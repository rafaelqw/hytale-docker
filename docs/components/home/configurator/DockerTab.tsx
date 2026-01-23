'use client';

import { Server, Cpu, HardDrive, Info, Container, FolderOpen, Plus, Trash2, Lock, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemoryBar } from './MemoryBar';
import type { ConfigState, BindMount } from './types';
import { TIMEZONES, MOUNT_PRESETS } from './types';

interface DockerTabProps {
	config: ConfigState;
	onConfigChange: (updates: Partial<ConfigState>) => void;
}

export function DockerTab({ config, onConfigChange }: DockerTabProps) {
	return (
		<ScrollArea className="h-[calc(100vh-22rem)] max-h-150 pr-4 mt-4">
			<div className="space-y-8 pb-4">
				{/* Container Settings */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Container className="w-5 h-5 text-primary" />
						<h3 className="font-medium">Container Settings</h3>
					</div>

					{/* Container Name */}
					<div className="space-y-2">
						<Label htmlFor="containerName">Container Name</Label>
						<Input
							id="containerName"
							value={config.containerName}
							onChange={(e) => onConfigChange({ containerName: e.target.value })}
							placeholder="hytale-server"
						/>
					</div>

					{/* Timezone */}
					<div className="space-y-2">
						<Label>Timezone</Label>
						<Select
							value={config.timezone}
							onValueChange={(value) => onConfigChange({ timezone: value })}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TIMEZONES.map((tz) => (
									<SelectItem key={tz} value={tz}>
										{tz}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Server Settings */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Settings className="w-5 h-5 text-primary" />
						<h3 className="font-medium">Server Settings</h3>
					</div>

					{/* Server Port */}
					<div className="space-y-2">
						<Label htmlFor="serverPort">Server Port (UDP)</Label>
						<Input
							id="serverPort"
							type="number"
							value={config.serverPort}
							onChange={(e) =>
								onConfigChange({ serverPort: parseInt(e.target.value) || 5520 })
							}
							min={1024}
							max={65535}
						/>
					</div>

					{/* Patchline */}
					<div className="space-y-2">
						<Label>Patchline</Label>
						<Select
							value={config.patchline}
							onValueChange={(value: 'release' | 'pre-release') =>
								onConfigChange({ patchline: value })
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="release">Release (Stable)</SelectItem>
								<SelectItem value="pre-release">Pre-release (Experimental)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Auto Update */}
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Auto Update</Label>
							<p className="text-sm text-muted-foreground">
								Automatically check for server updates on startup
							</p>
						</div>
						<Switch
							checked={config.autoUpdate}
							onCheckedChange={(checked) => onConfigChange({ autoUpdate: checked })}
						/>
					</div>
				</div>

				{/* Memory Allocation */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Server className="w-5 h-5 text-primary" />
						<h3 className="font-medium">Memory Allocation</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="w-4 h-4 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent className="max-w-xs">
								<p>Configure JVM heap memory (Xms/Xmx) and Docker container limits.</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<MemoryBar
						memoryMin={config.memoryMin}
						memoryMax={config.memoryMax}
						memoryLimit={config.memoryLimit}
					/>

					{/* JVM Heap Settings */}
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Cpu className="w-4 h-4 text-muted-foreground" />
									<Label>Initial Heap (Xms)</Label>
								</div>
								<span className="text-sm font-mono font-medium">{config.memoryMin}G</span>
							</div>
							<Slider
								value={[config.memoryMin]}
								onValueChange={([value]) =>
									onConfigChange({
										memoryMin: value,
										memoryMax: Math.max(value, config.memoryMax),
										memoryLimit: Math.max(value + 2, config.memoryLimit),
									})
								}
								min={1}
								max={32}
								step={1}
							/>
							<p className="text-xs text-muted-foreground">Memory allocated at JVM startup</p>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Cpu className="w-4 h-4 text-muted-foreground" />
									<Label>Max Heap (Xmx)</Label>
								</div>
								<span className="text-sm font-mono font-medium">{config.memoryMax}G</span>
							</div>
							<Slider
								value={[config.memoryMax]}
								onValueChange={([value]) =>
									onConfigChange({
										memoryMax: value,
										memoryMin: Math.min(value, config.memoryMin),
										memoryLimit: Math.max(value + 2, config.memoryLimit),
									})
								}
								min={1}
								max={32}
								step={1}
							/>
							<p className="text-xs text-muted-foreground">Maximum heap memory the JVM can use</p>
						</div>
					</div>

					{/* Container Limit */}
					<div className="space-y-3 pt-4 border-t">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<HardDrive className="w-4 h-4 text-muted-foreground" />
								<Label>Container Memory Limit</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info className="w-4 h-4 text-muted-foreground cursor-help" />
									</TooltipTrigger>
									<TooltipContent className="max-w-xs">
										<p>
											Docker will kill the container if it exceeds this limit. Should be higher than
											Xmx to allow for JVM overhead.
										</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<span className="text-sm font-mono font-medium">{config.memoryLimit}G</span>
						</div>
						<Slider
							value={[config.memoryLimit]}
							onValueChange={([value]) => onConfigChange({ memoryLimit: value })}
							min={config.memoryMax}
							max={64}
							step={1}
						/>
						<p className="text-xs text-muted-foreground">Recommended: Xmx + 2GB for JVM overhead</p>
					</div>
				</div>

				{/* Volume Configuration */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<FolderOpen className="w-5 h-5 text-primary" />
						<h3 className="font-medium">Data Storage</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="w-4 h-4 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent className="max-w-xs">
								<p>
									<strong>Named Volume:</strong> Docker-managed, portable, recommended for most users.<br />
									<strong>Bind Mount:</strong> Maps to a host folder, easier to access files directly.
								</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<Select
						value={config.volumeType}
						onValueChange={(value: 'volume' | 'bind') => onConfigChange({ volumeType: value })}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="volume">Named Volume (Docker-managed)</SelectItem>
							<SelectItem value="bind">Bind Mount (Host folder)</SelectItem>
						</SelectContent>
					</Select>

					{config.volumeType === 'volume' ? (
						<div className="space-y-2">
							<Label htmlFor="volumeName">Volume Name</Label>
							<Input
								id="volumeName"
								value={config.volumeName}
								onChange={(e) => onConfigChange({ volumeName: e.target.value })}
								placeholder="hytale-data"
							/>
						</div>
					) : (
						<div className="space-y-2">
							<Label htmlFor="bindPath">Host Path</Label>
							<Input
								id="bindPath"
								value={config.bindPath}
								onChange={(e) => onConfigChange({ bindPath: e.target.value })}
								placeholder="./server-data"
							/>
							<p className="text-xs text-muted-foreground">
								Relative (./path) or absolute (/path/to/data) path on the host
							</p>
						</div>
					)}

					{/* Custom Bind Mounts */}
					<div className="space-y-3 pt-3 border-t">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Label>Additional Bind Mounts</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info className="w-4 h-4 text-muted-foreground cursor-help" />
									</TooltipTrigger>
									<TooltipContent className="max-w-xs">
										<p>Mount specific files or folders from the host to override container paths.</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="gap-1">
										<Plus className="w-4 h-4" />
										Add Mount
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{MOUNT_PRESETS.map((preset) => {
										const isAdded = config.customMounts.some(m => m.containerPath === preset.containerPath);
										return (
											<DropdownMenuItem
												key={preset.containerPath}
												disabled={isAdded}
												onClick={() => {
													if (!isAdded) {
														const newMount: BindMount = {
															id: crypto.randomUUID(),
															hostPath: `.${preset.containerPath.replace('/server', '')}`,
															containerPath: preset.containerPath,
															readOnly: false,
														};
														onConfigChange({ customMounts: [...config.customMounts, newMount] });
													}
												}}
											>
												<div className="flex flex-col">
													<span>{preset.label}</span>
													<span className="text-xs text-muted-foreground">{preset.containerPath}</span>
												</div>
											</DropdownMenuItem>
										);
									})}
									<DropdownMenuItem
										onClick={() => {
											const newMount: BindMount = {
												id: crypto.randomUUID(),
												hostPath: './custom',
												containerPath: '/server/custom',
												readOnly: false,
											};
											onConfigChange({ customMounts: [...config.customMounts, newMount] });
										}}
									>
										<div className="flex flex-col">
											<span>Custom Mount</span>
											<span className="text-xs text-muted-foreground">Define your own paths</span>
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{config.customMounts.length === 0 ? (
							<p className="text-xs text-muted-foreground text-center py-2">
								No additional mounts configured
							</p>
						) : (
							<div className="space-y-2">
								{config.customMounts.map((mount) => (
									<div key={mount.id} className="flex items-start gap-2 p-3 rounded-lg border bg-muted/30">
										<div className="flex-1 grid grid-cols-2 gap-2">
											<div className="space-y-1">
												<Label className="text-xs">Host Path</Label>
												<Input
													value={mount.hostPath}
													onChange={(e) => {
														const updated = config.customMounts.map(m =>
															m.id === mount.id ? { ...m, hostPath: e.target.value } : m
														);
														onConfigChange({ customMounts: updated });
													}}
													placeholder="./config.json"
													className="h-8 text-sm"
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-xs">Container Path</Label>
												<Input
													value={mount.containerPath}
													onChange={(e) => {
														const updated = config.customMounts.map(m =>
															m.id === mount.id ? { ...m, containerPath: e.target.value } : m
														);
														onConfigChange({ customMounts: updated });
													}}
													placeholder="/server/config.json"
													className="h-8 text-sm"
												/>
											</div>
										</div>
										<div className="flex items-center gap-1 pt-5">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant={mount.readOnly ? 'secondary' : 'ghost'}
														size="icon"
														className="h-8 w-8"
														onClick={() => {
															const updated = config.customMounts.map(m =>
																m.id === mount.id ? { ...m, readOnly: !m.readOnly } : m
															);
															onConfigChange({ customMounts: updated });
														}}
													>
														<Lock className="w-3.5 h-3.5" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													{mount.readOnly ? 'Read-only (click to make writable)' : 'Writable (click to make read-only)'}
												</TooltipContent>
											</Tooltip>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:text-destructive"
												onClick={() => {
													const updated = config.customMounts.filter(m => m.id !== mount.id);
													onConfigChange({ customMounts: updated });
												}}
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
