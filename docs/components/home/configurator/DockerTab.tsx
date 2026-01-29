'use client';

import { Server, Cpu, HardDrive, Info, Container, FolderOpen, Plus, Trash2, Lock, Settings, Rocket, Beaker } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import type { ConfigState, Mount } from './types';
import { TIMEZONES, MOUNT_PRESETS } from './types';
import { cn } from '@/lib/utils';

interface DockerTabProps {
	config: ConfigState;
	onConfigChange: (updates: Partial<ConfigState>) => void;
}

export function DockerTab({ config, onConfigChange }: DockerTabProps) {
	return (
		<ScrollArea className="h-full mt-4 -mr-6 pr-6">
			<div className="space-y-6 pb-6">
				{/* Container Settings */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 mb-1">
						<Container className="w-4 h-4 text-primary" />
						<h3 className="font-semibold text-sm">Container Settings</h3>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						{/* Container Name */}
						<div className="space-y-1.5">
							<Label htmlFor="containerName" className="text-xs font-medium">Container Name</Label>
							<Input
								id="containerName"
								value={config.containerName}
								onChange={(e) => onConfigChange({ containerName: e.target.value })}
								placeholder="hytale-server"
								className="h-9"
							/>
						</div>

						{/* Timezone */}
						<div className="space-y-1.5">
							<Label className="text-xs font-medium">Timezone</Label>
							<Select
								value={config.timezone}
								onValueChange={(value) => onConfigChange({ timezone: value })}
							>
								<SelectTrigger className="h-9 w-full">
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
				</div>

				{/* Memory Allocation */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 mb-1">
						<Cpu className="w-4 h-4 text-primary" />
						<h3 className="font-semibold text-sm">Memory Allocation</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent className="max-w-xs text-xs">
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
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-medium">Initial Heap (Xms)</Label>
								<span className="text-xs font-mono font-semibold text-primary">{config.memoryMin}G</span>
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
							<p className="text-xs text-muted-foreground">Memory at JVM startup</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-medium">Max Heap (Xmx)</Label>
								<span className="text-xs font-mono font-semibold text-primary">{config.memoryMax}G</span>
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
							<p className="text-xs text-muted-foreground">Maximum heap memory</p>
						</div>
					</div>

					{/* Container Limit */}
					<div className="space-y-2 pt-2 border-t">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<Label className="text-xs font-medium">Container Limit</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
									</TooltipTrigger>
									<TooltipContent className="max-w-xs text-xs">
										<p>
											Docker kills the container if exceeded. Should be higher than Xmx for JVM overhead.
										</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<span className="text-xs font-mono font-semibold text-primary">{config.memoryLimit}G</span>
						</div>
						<Slider
							value={[config.memoryLimit]}
							onValueChange={([value]) => onConfigChange({ memoryLimit: value })}
							min={config.memoryMax}
							max={64}
							step={1}
						/>
						<p className="text-xs text-muted-foreground">Recommended: Xmx + 2GB</p>
					</div>
				</div>

				{/* Server Settings */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 mb-1">
						<Settings className="w-4 h-4 text-primary" />
						<h3 className="font-semibold text-sm">Server Settings</h3>
					</div>

					{/* Server Port */}
					<div className="space-y-1.5">
						<Label htmlFor="serverPort" className="text-xs font-medium">Server Port (UDP)</Label>
						<Input
							id="serverPort"
							type="number"
							value={config.serverPort}
							onChange={(e) =>
								onConfigChange({ serverPort: parseInt(e.target.value) || 5520 })
							}
							min={1024}
							max={65535}
							className="h-9"
						/>
					</div>

					{/* Patchline */}
					<div className="space-y-2">
						<Label className="text-xs font-medium">Patchline</Label>
						<RadioGroup
							value={config.patchline}
							onValueChange={(value: 'release' | 'pre-release') =>
								onConfigChange({ patchline: value })
							}
							className="gap-2"
						>
							<label
								htmlFor="patchline-release"
								className={cn(
									"relative flex cursor-pointer rounded-lg border p-3 transition-all",
									config.patchline === 'release'
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								)}
							>
								<div className="flex items-start gap-2.5 w-full">
									<RadioGroupItem
										value="release"
										id="patchline-release"
										className="mt-0.5"
									/>
									<div className="min-w-0">
										<div className="flex items-center gap-1.5 mb-0.5">
											<Rocket className="w-3.5 h-3.5 text-primary" />
											<span className="font-medium text-sm">Release</span>
										</div>
										<p className="text-xs text-muted-foreground leading-relaxed">
											Stable production-ready builds. Recommended for most users.
										</p>
									</div>
								</div>
							</label>

							<label
								htmlFor="patchline-prerelease"
								className={cn(
									"relative flex cursor-pointer rounded-lg border p-3 transition-all",
									config.patchline === 'pre-release'
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								)}
							>
								<div className="flex items-start gap-2.5 w-full">
									<RadioGroupItem
										value="pre-release"
										id="patchline-prerelease"
										className="mt-0.5"
									/>
									<div className="min-w-0">
										<div className="flex items-center gap-1.5 mb-0.5">
											<Beaker className="w-3.5 h-3.5 text-primary" />
											<span className="font-medium text-sm">Pre-release</span>
										</div>
										<p className="text-xs text-muted-foreground leading-relaxed">
											Experimental builds with latest features. May be unstable.
										</p>
									</div>
								</div>
							</label>
						</RadioGroup>
					</div>

					{/* Auto Update */}
					<div className="flex items-center justify-between pt-1">
						<div className="space-y-0.5">
							<Label className="text-sm font-medium">Auto Update</Label>
							<p className="text-xs text-muted-foreground">
								Check for updates on startup
							</p>
						</div>
						<Switch
							checked={config.autoUpdate}
							onCheckedChange={(checked) => onConfigChange({ autoUpdate: checked })}
						/>
					</div>
				</div>

				{/* Volume Configuration */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 mb-1">
						<FolderOpen className="w-4 h-4 text-primary" />
						<h3 className="font-semibold text-sm">Data Storage</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent className="max-w-xs text-xs">
								<p>Choose how to persist server data between restarts.</p>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* Storage Type Selection */}
					<RadioGroup
						value={config.volumeType}
						onValueChange={(value: 'volume' | 'bind') => onConfigChange({ volumeType: value })}
						className="gap-2"
					>
						<label
							htmlFor="storage-volume"
							className={cn(
								"relative flex cursor-pointer rounded-lg border p-3 transition-all",
								config.volumeType === 'volume'
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							)}
						>
							<div className="flex items-start gap-2.5 w-full">
								<RadioGroupItem
									value="volume"
									id="storage-volume"
									className="mt-0.5"
								/>
								<div className="min-w-0">
									<div className="flex items-center gap-1.5 mb-0.5">
										<Container className="w-3.5 h-3.5 text-primary" />
										<span className="font-medium text-sm">Named Volume</span>
									</div>
									<p className="text-xs text-muted-foreground leading-relaxed">
										Docker-managed storage. Portable and recommended for most users.
									</p>
								</div>
							</div>
						</label>

						<label
							htmlFor="storage-bind"
							className={cn(
								"relative flex cursor-pointer rounded-lg border p-3 transition-all",
								config.volumeType === 'bind'
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							)}
						>
							<div className="flex items-start gap-2.5 w-full">
								<RadioGroupItem
									value="bind"
									id="storage-bind"
									className="mt-0.5"
								/>
								<div className="min-w-0">
									<div className="flex items-center gap-1.5 mb-0.5">
										<HardDrive className="w-3.5 h-3.5 text-primary" />
										<span className="font-medium text-sm">Bind Mount</span>
									</div>
									<p className="text-xs text-muted-foreground leading-relaxed">
										Maps to a host directory. Direct file access from your system.
									</p>
								</div>
							</div>
						</label>
					</RadioGroup>

					{/* Volume/Bind Path Input */}
					{config.volumeType === 'volume' ? (
						<div className="space-y-1.5">
							<Label htmlFor="volumeName" className="text-xs font-medium">Volume Name</Label>
							<Input
								id="volumeName"
								value={config.volumeName}
								onChange={(e) => onConfigChange({ volumeName: e.target.value })}
								placeholder="hytale-data"
								className="h-8 text-sm"
							/>
						</div>
					) : (
						<div className="space-y-1.5">
							<Label htmlFor="bindPath" className="text-xs font-medium">Host Path</Label>
							<Input
								id="bindPath"
								value={config.bindPath}
								onChange={(e) => onConfigChange({ bindPath: e.target.value })}
								placeholder="./server-data"
								className="h-8 text-sm"
							/>
							<p className="text-xs text-muted-foreground">
								Relative or absolute path
							</p>
						</div>
					)}

					{/* Custom Bind Mounts */}
					<div className="space-y-2.5 pt-2 border-t">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<Label className="text-xs font-medium">Additional Mounts</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
									</TooltipTrigger>
									<TooltipContent className="max-w-xs text-xs">
										<p>Mount specific files or folders to customize configuration.</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
										<Plus className="w-3 h-3" />
										Add
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									{MOUNT_PRESETS.map((preset) => {
										const isAdded = config.customMounts.some(m => m.containerPath === preset.containerPath);
										return (
											<DropdownMenuItem
												key={preset.containerPath}
												disabled={isAdded}
												onClick={() => {
													if (!isAdded) {
														const newMount: Mount = {
															id: crypto.randomUUID(),
															type: 'bind',
															hostPath: `.${preset.containerPath.replace('/server', '')}`,
															containerPath: preset.containerPath,
															readOnly: false,
														};
														onConfigChange({ customMounts: [...config.customMounts, newMount] });
													}
												}}
												className="text-xs"
											>
												<div className="flex flex-col gap-0.5">
													<span className="font-medium">{preset.label}</span>
													<span className="text-xs text-muted-foreground">{preset.containerPath}</span>
												</div>
											</DropdownMenuItem>
										);
									})}
									<DropdownMenuItem
										onClick={() => {
											const newMount: Mount = {
												id: crypto.randomUUID(),
												type: 'bind',
												hostPath: './custom',
												containerPath: '/server/custom',
												readOnly: false,
											};
											onConfigChange({ customMounts: [...config.customMounts, newMount] });
										}}
										className="text-xs"
									>
										<div className="flex flex-col gap-0.5">
											<span className="font-medium">Custom Mount</span>
											<span className="text-xs text-muted-foreground">Define your own paths</span>
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{config.customMounts.length === 0 ? (
							<div className="rounded-lg border border-dashed bg-muted/20 p-4 text-center">
								<FolderOpen className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1.5" />
								<p className="text-xs text-muted-foreground">
									No additional mounts
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{config.customMounts.map((mount) => (
									<div key={mount.id} className="rounded-lg border bg-card/50 overflow-hidden">
										{/* Header with actions */}
										<div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/30 border-b">
											<div className="flex items-center gap-1.5 min-w-0">
												<FolderOpen className="w-3 h-3 text-muted-foreground shrink-0" />
												<span className="text-xs font-medium text-muted-foreground truncate">
													Mount Configuration
												</span>
											</div>
											<div className="flex items-center gap-1 shrink-0">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant={mount.readOnly ? 'secondary' : 'ghost'}
															size="icon"
															className="h-6 w-6"
															onClick={() => {
																const updated = config.customMounts.map(m =>
																	m.id === mount.id ? { ...m, readOnly: !m.readOnly } : m
																);
																onConfigChange({ customMounts: updated });
															}}
														>
															<Lock className="w-3 h-3" />
														</Button>
													</TooltipTrigger>
													<TooltipContent className="text-xs">
														{mount.readOnly ? 'Read-only' : 'Writable'}
													</TooltipContent>
												</Tooltip>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
													onClick={() => {
														const updated = config.customMounts.filter(m => m.id !== mount.id);
														onConfigChange({ customMounts: updated });
													}}
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
										</div>

										{/* Content */}
										<div className="p-3 space-y-2.5">
											{/* Mount Type */}
											<div className="space-y-1.5">
												<Label className="text-xs font-medium text-muted-foreground">Mount Type</Label>
												<RadioGroup
													value={mount.type}
													onValueChange={(value: 'volume' | 'bind') => {
														const updated = config.customMounts.map(m => {
															if (m.id === mount.id) {
																return {
																	...m,
																	type: value,
																	// Reset fields when switching types
																	hostPath: value === 'bind' ? (m.hostPath || './custom') : undefined,
																	volumeName: value === 'volume' ? (m.volumeName || 'custom-volume') : undefined,
																};
															}
															return m;
														});
														onConfigChange({ customMounts: updated });
													}}
													className="flex gap-2"
												>
													<label
														htmlFor={`${mount.id}-bind`}
														className={cn(
															"flex-1 flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 transition-all",
															mount.type === 'bind'
																? "border-primary bg-primary/5"
																: "border-border hover:border-primary/50"
														)}
													>
														<RadioGroupItem value="bind" id={`${mount.id}-bind`} />
														<HardDrive className="w-3.5 h-3.5" />
														<span className="text-xs font-medium">Bind</span>
													</label>
													<label
														htmlFor={`${mount.id}-volume`}
														className={cn(
															"flex-1 flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 transition-all",
															mount.type === 'volume'
																? "border-primary bg-primary/5"
																: "border-border hover:border-primary/50"
														)}
													>
														<RadioGroupItem value="volume" id={`${mount.id}-volume`} />
														<Container className="w-3.5 h-3.5" />
														<span className="text-xs font-medium">Volume</span>
													</label>
												</RadioGroup>
											</div>

											{/* Host Path (for bind) or Volume Name (for volume) */}
											{mount.type === 'bind' ? (
												<div className="space-y-1.5">
													<Label className="text-xs font-medium text-muted-foreground">Host Path</Label>
													<Input
														value={mount.hostPath || ''}
														onChange={(e) => {
															const updated = config.customMounts.map(m =>
																m.id === mount.id ? { ...m, hostPath: e.target.value } : m
															);
															onConfigChange({ customMounts: updated });
														}}
														placeholder="./config.json"
														className="h-8 text-xs font-mono"
													/>
												</div>
											) : (
												<div className="space-y-1.5">
													<Label className="text-xs font-medium text-muted-foreground">Volume Name</Label>
													<Input
														value={mount.volumeName || ''}
														onChange={(e) => {
															const updated = config.customMounts.map(m =>
																m.id === mount.id ? { ...m, volumeName: e.target.value } : m
															);
															onConfigChange({ customMounts: updated });
														}}
														placeholder="custom-volume"
														className="h-8 text-xs font-mono"
													/>
												</div>
											)}

											{/* Container Path */}
											<div className="space-y-1.5">
												<Label className="text-xs font-medium text-muted-foreground">Container Path</Label>
												<Input
													value={mount.containerPath}
													onChange={(e) => {
														const updated = config.customMounts.map(m =>
															m.id === mount.id ? { ...m, containerPath: e.target.value } : m
														);
														onConfigChange({ customMounts: updated });
													}}
													placeholder="/server/config.json"
													className="h-8 text-xs font-mono"
												/>
											</div>
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
