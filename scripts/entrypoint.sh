#!/bin/bash
# =============================================================================
# Hytale Server Docker Entrypoint
# Handles: version check → download → start server → auto-auth
# =============================================================================

set -euo pipefail

# =============================================================================
# Configuration
# =============================================================================
readonly SERVER_DIR="/server"
readonly SERVER_JAR="${SERVER_DIR}/Server/HytaleServer.jar"
readonly ASSETS_ZIP="${SERVER_DIR}/Assets.zip"
readonly AUTH_FILE="${SERVER_DIR}/.auth_completed"
readonly VERSION_FILE="${SERVER_DIR}/.downloader_version"
readonly HYTALE_DOWNLOADER="/usr/local/bin/hytale-downloader"

# =============================================================================
# Logging
# =============================================================================
log_info()    { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $*"; }
log_warn()    { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] $*" >&2; }
log_error()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2; }
log_success() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [OK] $*"; }

# =============================================================================
# Signal Handler
# =============================================================================
cleanup() {
    log_info "Shutting down..."
    [[ -n "${SERVER_PID:-}" ]] && kill -TERM "${SERVER_PID}" 2>/dev/null
    [[ -n "${AUTH_MONITOR_PID:-}" ]] && kill "${AUTH_MONITOR_PID}" 2>/dev/null
    [[ -n "${STDIN_PID:-}" ]] && kill "${STDIN_PID}" 2>/dev/null
    exec 3>&- 2>/dev/null
    rm -f /tmp/server_input
    exit 0
}
trap cleanup SIGTERM SIGINT SIGQUIT

# =============================================================================
# Pre-flight Checks
# =============================================================================
preflight_checks() {
    log_info "Running pre-flight checks..."
    
    # Java version
    local java_ver
    java_ver=$(java --version 2>&1 | head -n1 | sed 's/[^0-9]*\([0-9]*\).*/\1/')
    [[ "${java_ver}" -lt 25 ]] && { log_error "Java 25+ required (found: ${java_ver})"; exit 1; }
    log_success "Java ${java_ver}"
    
    # hytale-downloader version
    if command -v hytale-downloader &>/dev/null; then
        local dl_version
        dl_version=$(hytale-downloader -version 2>&1 | head -n1 || echo "unknown")
        log_success "hytale-downloader: ${dl_version}"
        
        # Save version for reference
        echo "${dl_version}" > "${VERSION_FILE}"
    else
        log_error "hytale-downloader not found"
        exit 1
    fi
    
    # Required tools
    for tool in unzip; do
        command -v "${tool}" &>/dev/null || { log_error "Missing: ${tool}"; exit 1; }
    done
    log_success "Dependencies OK"
}

# =============================================================================
# Download Server Files
# =============================================================================
download_server() {
    # Skip if files exist and FORCE_UPDATE is not set
    if [[ -f "${SERVER_JAR}" ]] && [[ -f "${ASSETS_ZIP}" ]]; then
        if [[ "${FORCE_UPDATE:-false}" != "true" ]]; then
            log_success "Server files exist (use FORCE_UPDATE=true to re-download)"
            return 0
        fi
        log_info "FORCE_UPDATE=true, re-downloading..."
    else
        log_info "Server files not found, downloading..."
    fi
    
    # Download
    local download_dir="${SERVER_DIR}/.cache"
    mkdir -p "${download_dir}"
    cd "${download_dir}"
    
    log_info "Running hytale-downloader..."
    if ! "${HYTALE_DOWNLOADER}"; then
        log_error "Download failed"
        cd "${SERVER_DIR}"
        return 1
    fi
    
    # Find and extract zip
    local zip_file
    zip_file=$(find "${download_dir}" -maxdepth 1 -name "*.zip" -type f | head -1)
    
    if [[ -z "${zip_file}" ]]; then
        log_error "No zip file found"
        cd "${SERVER_DIR}"
        return 1
    fi
    
    log_info "Extracting..."
    unzip -o "${zip_file}" -d "${SERVER_DIR}" || { log_error "Extraction failed"; return 1; }
    
    # Cleanup
    rm -rf "${download_dir}"
    cd "${SERVER_DIR}"
    
    # Verify
    [[ -f "${SERVER_JAR}" ]] || { log_error "Server JAR missing"; return 1; }
    [[ -f "${ASSETS_ZIP}" ]] || { log_error "Assets.zip missing"; return 1; }
    
    log_success "Server files ready"
    return 0
}

# =============================================================================
# Build Launch Command
# =============================================================================
build_launch_cmd() {
    local cmd="java"
    
    # Java options
    cmd+=" ${JAVA_OPTS:--Xms4G -Xmx8G}"
    
    # AOT cache
    local aot="${SERVER_DIR}/Server/HytaleServer.aot"
    [[ "${USE_AOT_CACHE:-true}" == "true" ]] && [[ -f "${aot}" ]] && cmd+=" -XX:AOTCache=${aot}"
    
    # Server JAR and args
    cmd+=" -jar ${SERVER_JAR}"
    cmd+=" --assets ${ASSETS_ZIP}"
    cmd+=" --bind 0.0.0.0:${SERVER_PORT:-5520}"
    
    # Optional flags
    [[ "${DISABLE_SENTRY:-false}" == "true" ]] && cmd+=" --disable-sentry"
    [[ -n "${EXTRA_ARGS:-}" ]] && cmd+=" ${EXTRA_ARGS}"
    
    echo "${cmd}"
}

# =============================================================================
# Auto-Auth Monitor
# Handles:
#   - First-time auth: /auth login device → /auth persistence Encrypted
#   - Restart auth: If persistence wasn't saved, re-run /auth login device
# =============================================================================
start_auth_monitor() {
    (
        local auth_sent=false
        local persistence_sent=false
        local server_booted=false
        
        # Skip if disabled
        [[ "${AUTO_AUTH:-true}" != "true" ]] && exit 0
        
        while kill -0 ${SERVER_PID} 2>/dev/null; do
            sleep 1
            
            # Wait for server to boot
            if [[ "${server_booted}" == "false" ]] && grep -q "Hytale Server Booted" /tmp/server_output.log 2>/dev/null; then
                server_booted=true
                sleep 3
                
                # Check if persistence was saved (already authenticated from encrypted file)
                if grep -q "Successfully authenticated from encrypted file" /tmp/server_output.log 2>/dev/null; then
                    log_success "Persistence OK - authenticated from encrypted file"
                    touch "${AUTH_FILE}"
                    exit 0
                fi
                
                # Not authenticated automatically → need to run device auth
                log_info "Server ready, sending /auth login device..."
                echo "/auth login device" >&3
                auth_sent=true
            fi
            
            # Send /auth persistence Encrypted after successful auth
            if [[ "${auth_sent}" == "true" ]] && [[ "${persistence_sent}" == "false" ]]; then
                if grep -q "Authentication successful" /tmp/server_output.log 2>/dev/null; then
                    sleep 2
                    log_info "Auth successful, enabling encrypted persistence..."
                    echo "/auth persistence Encrypted" >&3
                    persistence_sent=true
                    touch "${AUTH_FILE}"
                    log_success "Auto-auth complete with encrypted persistence"
                fi
            fi
        done
    ) &
    AUTH_MONITOR_PID=$!
}

# =============================================================================
# Main
# =============================================================================
main() {
    echo "============================================================"
    echo "  Hytale Dedicated Server - Docker Edition"
    echo "============================================================"
    echo ""
    
    preflight_checks
    
    # Download/update server files
    if [[ "${AUTO_UPDATE:-true}" == "true" ]]; then
        download_server || {
            [[ -f "${SERVER_JAR}" ]] && log_warn "Using existing files..." || exit 1
        }
    else
        [[ -f "${SERVER_JAR}" ]] || { log_error "Server files missing"; exit 1; }
    fi
    
    # Setup FIFO for stdin
    rm -f /tmp/server_input /tmp/server_output.log
    mkfifo /tmp/server_input
    exec 3<>/tmp/server_input
    
    # Start server
    local launch_cmd
    launch_cmd=$(build_launch_cmd)
    log_info "Starting: ${launch_cmd}"
    echo ""
    log_info "========== SERVER OUTPUT =========="
    echo ""
    
    cd "${SERVER_DIR}"
    ${launch_cmd} <&3 2>&1 | tee /tmp/server_output.log &
    SERVER_PID=$!
    
    # Start auth monitor
    start_auth_monitor
    
    # Forward stdin to FIFO using cat (works better with docker attach)
    cat >&3 &
    STDIN_PID=$!
    
    # Wait for server to exit
    wait ${SERVER_PID} 2>/dev/null
    exit_code=$?
    
    cleanup
    exit "${exit_code}"
}

main "$@"
