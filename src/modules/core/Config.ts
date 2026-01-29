import type { Paths, RuntimeEnv } from "../../types";

const SERVER_DIR = "/server";

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function hasEnv(env: RuntimeEnv, key: keyof RuntimeEnv): boolean {
  return Object.prototype.hasOwnProperty.call(env, key);
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Runtime configuration from environment variables
 */
export class Config {
  readonly paths: Paths;
  readonly javaOpts: string;
  readonly serverPort: number;
  readonly patchline: string;
  readonly forceUpdate: boolean;
  readonly autoUpdate: boolean;
  readonly useAotCache: boolean;
  readonly disableSentry: boolean;
  readonly autoRefreshTokens: boolean;
  readonly autoSelectProfile: boolean;
  readonly extraArgs: string;
  readonly serverConfigOverrides: {
    serverName: { set: boolean; value?: string };
    motd: { set: boolean; value?: string };
    password: { set: boolean; value?: string };
    maxPlayers: { set: boolean; value?: number };
    maxViewRadius: { set: boolean; value?: number };
    defaultWorld: { set: boolean; value?: string };
    defaultGameMode: { set: boolean; value?: string };
  };
  // CurseForge mod support
  readonly cfApiKey: string | null;
  readonly cfMods: string;
  // Modtale mod support
  readonly mtApiKey: string | null;
  readonly mtMods: string;

  constructor(env: RuntimeEnv = process.env) {
    const tokenDir = env.HYTALE_TOKEN_DIR ?? `${SERVER_DIR}/.hytale/tokens`;

    this.paths = {
      SERVER_DIR,
      SERVER_JAR: `${SERVER_DIR}/Server/HytaleServer.jar`,
      ASSETS_ZIP: `${SERVER_DIR}/Assets.zip`,
      VERSION_FILE: `${SERVER_DIR}/.downloader_version`,
      VERSION_INFO_FILE: `${SERVER_DIR}/.version_info`,
      HYTALE_DOWNLOADER: "/usr/local/bin/hytale-downloader",
      SERVER_INPUT: "/tmp/server_input",
      SERVER_OUTPUT: "/tmp/server_output.log",
      TOKEN_DIR: tokenDir,
      OAUTH_TOKEN_FILE: `${tokenDir}/oauth_tokens.json`,
      SESSION_TOKEN_FILE: `${tokenDir}/session_tokens.json`,
      PROFILE_CACHE_FILE: `${tokenDir}/profiles.json`,
      SELECTED_PROFILE_FILE: `${tokenDir}/selected_profile.json`,
      DOWNLOADER_CREDENTIALS_FILE: `${SERVER_DIR}/.cache/.hytale-downloader-credentials.json`,
    };

    this.javaOpts = env.JAVA_OPTS ?? "-Xms4G -Xmx8G";
    this.serverPort = parseNumber(env.SERVER_PORT, 5520);
    this.patchline = env.PATCHLINE ?? "release";
    this.forceUpdate = parseBool(env.FORCE_UPDATE, false);
    this.autoUpdate = parseBool(env.AUTO_UPDATE, false);
    this.useAotCache = parseBool(env.USE_AOT_CACHE, true);
    this.disableSentry = parseBool(env.DISABLE_SENTRY, false);
    this.autoRefreshTokens = parseBool(env.AUTO_REFRESH_TOKENS, true);
    this.autoSelectProfile = parseBool(env.AUTOSELECT_GAME_PROFILE, true);
    this.extraArgs = env.EXTRA_ARGS ?? "";
    this.serverConfigOverrides = {
      serverName: {
        set: hasEnv(env, "SERVER_NAME"),
        value: env.SERVER_NAME ?? "",
      },
      motd: {
        set: hasEnv(env, "MOTD"),
        value: env.MOTD ?? "",
      },
      password: {
        set: hasEnv(env, "PASSWORD"),
        value: env.PASSWORD ?? "",
      },
      maxPlayers: {
        set: hasEnv(env, "MAX_PLAYERS"),
        value: parseOptionalNumber(env.MAX_PLAYERS),
      },
      maxViewRadius: {
        set: hasEnv(env, "MAX_VIEW_RADIUS"),
        value: parseOptionalNumber(env.MAX_VIEW_RADIUS),
      },
      defaultWorld: {
        set: hasEnv(env, "DEFAULT_WORLD"),
        value: env.DEFAULT_WORLD ?? "",
      },
      defaultGameMode: {
        set: hasEnv(env, "DEFAULT_GAME_MODE"),
        value: env.DEFAULT_GAME_MODE ?? "",
      },
    };
    // CurseForge mod support
    this.cfApiKey = env.CF_API_KEY ?? null;
    this.cfMods = env.CF_MODS ?? "";
    // Modtale mod support
    this.mtApiKey = env.MT_API_KEY ?? null;
    this.mtMods = env.MT_MODS ?? "";
  }
}
