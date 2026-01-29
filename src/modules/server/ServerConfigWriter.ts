import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ILogger, Paths } from "../../types";
import type { Config } from "../core/Config";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function applyServerConfigOverrides(
  logger: ILogger,
  config: Config,
  paths: Paths,
): Promise<void> {
  const overrides = config.serverConfigOverrides;
  const hasOverrides = Object.values(overrides).some((override) => override.set);
  if (!hasOverrides) return;

  const configPath = join(paths.SERVER_DIR, "Server", "config.json");
  if (!existsSync(configPath)) {
    logger.warn(`Server config.json not found at ${configPath}`);
    return;
  }

  let raw: string;
  try {
    raw = await readFile(configPath, "utf-8");
  } catch (error) {
    logger.warn(`Failed to read config.json: ${(error as Error).message}`);
    return;
  }

  let data: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw) as unknown;
    data = isObject(parsed) ? parsed : {};
  } catch (error) {
    logger.warn(`Failed to parse config.json: ${(error as Error).message}`);
    return;
  }

  let changed = false;

  if (overrides.serverName.set) {
    data.ServerName = overrides.serverName.value ?? "";
    changed = true;
  }

  if (overrides.motd.set) {
    data.MOTD = overrides.motd.value ?? "";
    changed = true;
  }

  if (overrides.password.set) {
    data.Password = overrides.password.value ?? "";
    changed = true;
  }

  if (overrides.maxPlayers.set) {
    if (overrides.maxPlayers.value === undefined) {
      logger.warn("MAX_PLAYERS is set but not a valid number; ignoring override");
    } else {
      data.MaxPlayers = overrides.maxPlayers.value;
      changed = true;
    }
  }

  if (overrides.maxViewRadius.set) {
    if (overrides.maxViewRadius.value === undefined) {
      logger.warn("MAX_VIEW_RADIUS is set but not a valid number; ignoring override");
    } else {
      data.MaxViewRadius = overrides.maxViewRadius.value;
      changed = true;
    }
  }

  if (overrides.defaultWorld.set || overrides.defaultGameMode.set) {
    const defaults = isObject(data.Defaults) ? data.Defaults : {};

    if (overrides.defaultWorld.set) {
      defaults.World = overrides.defaultWorld.value ?? "";
      changed = true;
    }

    if (overrides.defaultGameMode.set) {
      defaults.GameMode = overrides.defaultGameMode.value ?? "";
      changed = true;
    }

    data.Defaults = defaults;
  }

  if (!changed) return;

  try {
    await writeFile(configPath, `${JSON.stringify(data, null, 2)}\n`);
    logger.info("Applied server config overrides to config.json");
  } catch (error) {
    logger.warn(`Failed to write config.json: ${(error as Error).message}`);
  }
}
