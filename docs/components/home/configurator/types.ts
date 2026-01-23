export type ModProvider = 'curseforge' | 'modtale';

export interface CurseForgeFile {
	id: number;
	displayName: string;
	fileName: string;
	releaseType: number;
	gameVersions: string[];
	downloadCount: number;
	fileDate: string;
}

export interface FileIndex {
	gameVersion: string;
	fileId: number;
	filename: string;
	releaseType: number;
}

export interface ModAuthor {
	id: number;
	name: string;
	url: string;
}

export interface CurseForgeMod {
	id: number;
	name: string;
	slug: string;
	summary: string;
	downloadCount: number;
	thumbsUpCount: number;
	logo?: {
		thumbnailUrl: string;
	};
	links?: {
		websiteUrl: string;
	};
	authors: ModAuthor[];
	latestFiles?: CurseForgeFile[];
	latestFilesIndexes?: FileIndex[];
}

export interface ModtaleVersion {
	version: string;
	fileName: string;
	fileSize: number;
	releaseDate: string;
}

export interface ModtaleMod {
	id: string; // UUID
	name: string;
	slug: string;
	summary: string;
	downloads: number;
	imageUrl?: string;
	tags?: string[];
	versions: ModtaleVersion[];
}

export interface SelectedMod {
	provider: ModProvider;
	id: string | number; // Support both UUID (Modtale) and numeric (CurseForge)
	name: string;
	slug: string;
	summary: string;
	downloadCount: number;
	logo?: {
		thumbnailUrl: string;
	};
	imageUrl?: string; // Modtale uses imageUrl
	links?: {
		websiteUrl: string;
	};
	authors?: ModAuthor[]; // Optional for Modtale
	latestFilesIndexes?: FileIndex[];
	fileId?: number; // CurseForge file ID
	fileName?: string;
	version?: string; // Modtale version (semver) or display version
	versionType: 'latest' | 'specific';
}

export interface BindMount {
	id: string;
	hostPath: string;
	containerPath: string;
	readOnly?: boolean;
}

export interface ConfigState {
	containerName: string;
	memoryMin: number;
	memoryMax: number;
	memoryLimit: number;
	serverPort: number;
	patchline: 'release' | 'pre-release';
	autoUpdate: boolean;
	timezone: string;
	cfApiKey: string;
	mtApiKey: string; // Modtale API key
	selectedMods: SelectedMod[];
	// Volume configuration
	volumeType: 'volume' | 'bind';
	volumeName: string;
	bindPath: string;
	customMounts: BindMount[];
	// Server config.json options
	serverName: string;
	motd: string;
	password: string;
	maxPlayers: number;
	maxViewRadius: number;
	defaultWorld: string;
	defaultGameMode: 'Adventure' | 'Creative' | 'Survival';
}

// Common mount presets for quick adding
export const MOUNT_PRESETS = [
	{ label: 'Server Config', containerPath: '/server/config.json', description: 'Main server configuration' },
	{ label: 'Worlds Folder', containerPath: '/server/worlds', description: 'World save data' },
	{ label: 'Mods Folder', containerPath: '/server/mods', description: 'Server mods' },
	{ label: 'Logs Folder', containerPath: '/server/logs', description: 'Server logs' },
] as const;

export interface PaginationInfo {
	index: number;
	pageSize: number;
	resultCount: number;
	totalCount: number;
}

export const TIMEZONES = [
	'UTC',
	'America/New_York',
	'America/Chicago',
	'America/Denver',
	'America/Los_Angeles',
	'Europe/London',
	'Europe/Paris',
	'Europe/Berlin',
	'Asia/Tokyo',
	'Asia/Shanghai',
	'Australia/Sydney',
] as const;

export const PAGE_SIZE = 20;

export type SortOption = 'popularity' | 'downloads' | 'updated' | 'name';
