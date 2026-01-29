'use client';

import { useState } from 'react';
import { Eye, EyeOff, FileJson, Compass, Paintbrush } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ConfigState } from './types';
import { cn } from '@/lib/utils';

interface GeneralTabProps {
	config: ConfigState;
	onConfigChange: (updates: Partial<ConfigState>) => void;
}

export function GeneralTab({ config, onConfigChange }: GeneralTabProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<ScrollArea className="h-full mt-4 -mr-6 pr-6">
			<div className="space-y-6 pb-6">
				{/* Server Configuration */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 mb-1">
						<FileJson className="w-4 h-4 text-primary" />
						<h3 className="font-semibold text-sm">Server Configuration</h3>
					</div>

					{/* Server Name */}
					<div className="space-y-1.5">
						<Label htmlFor="serverName" className="text-xs font-medium">Server Name</Label>
						<Input
							id="serverName"
							value={config.serverName}
							onChange={(e) => onConfigChange({ serverName: e.target.value })}
							placeholder="Hytale Server"
							className="h-9"
						/>
					</div>

					{/* MOTD */}
					<div className="space-y-1.5">
						<Label htmlFor="motd" className="text-xs font-medium">Message of the Day</Label>
						<Input
							id="motd"
							value={config.motd}
							onChange={(e) => onConfigChange({ motd: e.target.value })}
							placeholder="Welcome to my server!"
							className="h-9"
						/>
					</div>

					{/* Password */}
					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-xs font-medium">Server Password</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								value={config.password}
								onChange={(e) => onConfigChange({ password: e.target.value })}
								placeholder="Leave empty for no password"
								className="h-9 pr-9"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
								) : (
									<Eye className="w-3.5 h-3.5 text-muted-foreground" />
								)}
							</Button>
						</div>
					</div>

					{/* Max Players and View Radius */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-medium">Max Players</Label>
								<span className="text-xs font-mono font-semibold text-primary">{config.maxPlayers}</span>
							</div>
							<Slider
								value={[config.maxPlayers]}
								onValueChange={([value]) => onConfigChange({ maxPlayers: value })}
								min={1}
								max={500}
								step={1}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-medium">Max View Radius</Label>
								<span className="text-xs font-mono font-semibold text-primary">{config.maxViewRadius}</span>
							</div>
							<Slider
								value={[config.maxViewRadius]}
								onValueChange={([value]) => onConfigChange({ maxViewRadius: value })}
								min={8}
								max={64}
								step={1}
							/>
						</div>
					</div>

					{/* Default World */}
					<div className="space-y-1.5">
						<Label htmlFor="defaultWorld" className="text-xs font-medium">Default World</Label>
						<Input
							id="defaultWorld"
							value={config.defaultWorld}
							onChange={(e) => onConfigChange({ defaultWorld: e.target.value })}
							placeholder="default"
							className="h-9"
						/>
					</div>

					{/* Default Game Mode */}
					<div className="space-y-2">
						<Label className="text-xs font-medium">Default Game Mode</Label>
						<RadioGroup
							value={config.defaultGameMode}
							onValueChange={(value: 'Adventure' | 'Creative') =>
								onConfigChange({ defaultGameMode: value })
							}
							className="grid gap-2 sm:grid-cols-2"
						>
							<label
								htmlFor="gamemode-adventure"
								className={cn(
									"flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-all",
									config.defaultGameMode === 'Adventure'
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								)}
							>
								<RadioGroupItem
									value="Adventure"
									id="gamemode-adventure"
								/>
								<Compass className="w-3.5 h-3.5 text-primary" />
								<span className="font-medium text-sm">Adventure</span>
							</label>

							<label
								htmlFor="gamemode-creative"
								className={cn(
									"flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-all",
									config.defaultGameMode === 'Creative'
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								)}
							>
								<RadioGroupItem
									value="Creative"
									id="gamemode-creative"
								/>
								<Paintbrush className="w-3.5 h-3.5 text-primary" />
								<span className="font-medium text-sm">Creative</span>
							</label>
						</RadioGroup>
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
