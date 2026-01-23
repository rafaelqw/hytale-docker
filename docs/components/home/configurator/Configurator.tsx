'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/styled-tabs';
import { DockerTab } from './DockerTab';
import { GeneralTab } from './GeneralTab';
import { ModsTab } from './ModsTab';
import { ComposePreview } from './ComposePreview';
import type { ConfigState } from './types';

const DEFAULT_CONFIG: ConfigState = {
	containerName: 'hytale-server',
	memoryMin: 4,
	memoryMax: 8,
	memoryLimit: 10,
	serverPort: 5520,
	patchline: 'release',
	autoUpdate: false,
	timezone: 'UTC',
	cfApiKey: '',
	mtApiKey: '',
	selectedMods: [],
	// Volume configuration
	volumeType: 'volume',
	volumeName: 'hytale-data',
	bindPath: './server-data',
	customMounts: [],
	// Server config.json options
	serverName: 'Hytale Server',
	motd: '',
	password: '',
	maxPlayers: 100,
	maxViewRadius: 32,
	defaultWorld: 'default',
	defaultGameMode: 'Adventure',
};

export function Configurator() {
	const [copied, setCopied] = useState(false);
	const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);

	const handleConfigChange = (updates: Partial<ConfigState>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	};

	const composeContent = useMemo(() => {
		// Separate CurseForge and Modtale mods
		const cfMods = config.selectedMods.filter((m) => m.provider === 'curseforge');
		const mtMods = config.selectedMods.filter((m) => m.provider === 'modtale');

		const cfModsString =
			cfMods.length > 0
				? cfMods.map((m) => (m.fileId ? `${m.id}:${m.fileId}` : String(m.id))).join(',')
				: null;

		const mtModsString =
			mtMods.length > 0
				? mtMods.map((m) => (m.version ? `${m.id}:${m.version}` : String(m.id))).join(',')
				: null;

		const lines = [
			'services:',
			'  hytale:',
			'    image: rxmarin/hytale-docker:latest',
			`    container_name: ${config.containerName}`,
			'    restart: unless-stopped',
			'    stdin_open: true',
			'    tty: true',
			'    ports:',
			`      - "${config.serverPort}:${config.serverPort}/udp"`,
			'    ',
			'    environment:',
			`      JAVA_OPTS: "-Xms${config.memoryMin}G -Xmx${config.memoryMax}G -XX:+UseG1GC"`,
			`      SERVER_PORT: "${config.serverPort}"`,
			`      PATCHLINE: "${config.patchline}"`,
			`      AUTO_UPDATE: "${config.autoUpdate}"`,
			`      TZ: "${config.timezone}"`,
		];

		// Optional server config - only add if different from defaults
		const hasServerConfig = 
			config.serverName !== 'Hytale Server' ||
			config.motd ||
			config.password ||
			config.maxPlayers !== 100 ||
			config.maxViewRadius !== 32 ||
			config.defaultWorld !== 'default' ||
			config.defaultGameMode !== 'Adventure';

		if (hasServerConfig) {
			lines.push('      # Server Configuration');
			if (config.serverName !== 'Hytale Server') {
				lines.push(`      SERVER_NAME: "${config.serverName}"`);
			}
			if (config.maxPlayers !== 100) {
				lines.push(`      MAX_PLAYERS: "${config.maxPlayers}"`);
			}
			if (config.maxViewRadius !== 32) {
				lines.push(`      MAX_VIEW_RADIUS: "${config.maxViewRadius}"`);
			}
			if (config.defaultWorld !== 'default') {
				lines.push(`      DEFAULT_WORLD: "${config.defaultWorld}"`);
			}
			if (config.defaultGameMode !== 'Adventure') {
				lines.push(`      DEFAULT_GAME_MODE: "${config.defaultGameMode}"`);
			}
			if (config.motd) {
				lines.push(`      MOTD: "${config.motd}"`);
			}
			if (config.password) {
				lines.push(`      PASSWORD: "${config.password}"`);
			}
		}

		// CurseForge Mods
		if (config.cfApiKey || cfModsString) {
			lines.push('      # CurseForge Mods');
			if (config.cfApiKey) {
				// Escape all $ characters for docker-compose variable substitution
				const escapedCfKey = config.cfApiKey.replace(/\$/g, '$$$$');
				lines.push(`      CF_API_KEY: "${escapedCfKey}"`);
			}
			if (cfModsString) {
				lines.push(`      CF_MODS: "${cfModsString}"`);
			}
		}

		// Modtale Mods
		if (config.mtApiKey || mtModsString) {
			lines.push('      # Modtale Mods');
			if (config.mtApiKey) {
				// Escape all $ characters for docker-compose variable substitution
				const escapedMtKey = config.mtApiKey.replace(/\$/g, '$$$$');
				lines.push(`      MT_API_KEY: "${escapedMtKey}"`);
			}
			if (mtModsString) {
				lines.push(`      MT_MODS: "${mtModsString}"`);
			}
		}

		lines.push(
			'    ',
			'    volumes:',
		);

		// Base volume mount based on type
		if (config.volumeType === 'bind') {
			lines.push(`      - ${config.bindPath}:/server`);
		} else {
			lines.push(`      - ${config.volumeName}:/server`);
		}

		// Custom bind mounts
		for (const mount of config.customMounts) {
			const suffix = mount.readOnly ? ':ro' : '';
			lines.push(`      - ${mount.hostPath}:${mount.containerPath}${suffix}`);
		}

		lines.push('      - /etc/machine-id:/etc/machine-id:ro');

		lines.push(
			'    ',
			'    deploy:',
			'      resources:',
			'        limits:',
			`          memory: ${config.memoryLimit}G`,
			'        reservations:',
			`          memory: ${config.memoryMin}G`,
			'    ',
			'    healthcheck:',
			'      test: ["CMD", "pgrep", "-f", "HytaleServer.jar"]',
			'      interval: 30s',
			'      timeout: 10s',
			'      retries: 3',
			'      start_period: 120s',
		);

		// Only add volumes section for named volumes
		if (config.volumeType === 'volume') {
			lines.push(
				'',
				'volumes:',
				`  ${config.volumeName}:`,
			);
		}

		return lines.join('\n');
	}, [config]);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(composeContent);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<TooltipProvider>
			<motion.section
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.1 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className="w-full py-24 bg-background"
			>
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Docker Compose Configurator
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
							Customize your Hytale server configuration and get a ready-to-use docker-compose.yml
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
						{/* Left side - Configuration Form */}
						<div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col lg:max-h-175">
							<Tabs defaultValue="docker" className="w-full flex flex-col flex-1 min-h-0">
								<TabsList className="w-full grid grid-cols-3 shrink-0">
									<TabsTrigger value="docker">General</TabsTrigger>
									<TabsTrigger value="server">Config</TabsTrigger>
									<TabsTrigger value="mods">Mods</TabsTrigger>
								</TabsList>

								<TabsContent value="docker" className="flex flex-col flex-1 min-h-0">
									<DockerTab config={config} onConfigChange={handleConfigChange} />
								</TabsContent>

								<TabsContent value="server" className="flex flex-col flex-1 min-h-0">
									<GeneralTab config={config} onConfigChange={handleConfigChange} />
								</TabsContent>

								<TabsContent value="mods" className="flex flex-col flex-1 min-h-0">
									<ModsTab config={config} onConfigChange={handleConfigChange} />
								</TabsContent>
							</Tabs>
						</div>

						{/* Right side - Docker Compose Preview */}
						<ComposePreview
							content={composeContent}
							copied={copied}
							onCopy={copyToClipboard}
						/>
					</div>
				</div>
			</motion.section>
		</TooltipProvider>
	);
}
