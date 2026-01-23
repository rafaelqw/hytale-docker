'use client';

import { useState } from 'react';
import { Eye, EyeOff, FileJson } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { ConfigState } from './types';

interface GeneralTabProps {
	config: ConfigState;
	onConfigChange: (updates: Partial<ConfigState>) => void;
}

export function GeneralTab({ config, onConfigChange }: GeneralTabProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<ScrollArea className="h-[calc(100vh-22rem)] max-h-150 pr-4 mt-4">
			<div className="space-y-6 pb-4">
				{/* Server Configuration */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<FileJson className="w-5 h-5 text-primary" />
						<h3 className="font-medium">Server Configuration</h3>
					</div>

					{/* Server Name */}
					<div className="space-y-2">
						<Label htmlFor="serverName">Server Name</Label>
						<Input
							id="serverName"
							value={config.serverName}
							onChange={(e) => onConfigChange({ serverName: e.target.value })}
							placeholder="Hytale Server"
						/>
					</div>

					{/* MOTD */}
					<div className="space-y-2">
						<Label htmlFor="motd">Message of the Day (MOTD)</Label>
						<Input
							id="motd"
							value={config.motd}
							onChange={(e) => onConfigChange({ motd: e.target.value })}
							placeholder="Welcome to my server!"
						/>
					</div>

					{/* Password */}
					<div className="space-y-2">
						<Label htmlFor="password">Server Password</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								value={config.password}
								onChange={(e) => onConfigChange({ password: e.target.value })}
								placeholder="Leave empty for no password"
								className="pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className="w-4 h-4 text-muted-foreground" />
								) : (
									<Eye className="w-4 h-4 text-muted-foreground" />
								)}
							</Button>
						</div>
					</div>

					{/* Max Players */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label>Max Players</Label>
							<span className="text-sm font-mono font-medium">{config.maxPlayers}</span>
						</div>
						<Slider
							value={[config.maxPlayers]}
							onValueChange={([value]) => onConfigChange({ maxPlayers: value })}
							min={1}
							max={500}
							step={1}
						/>
					</div>

					{/* Max View Radius */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label>Max View Radius</Label>
							<span className="text-sm font-mono font-medium">{config.maxViewRadius}</span>
						</div>
						<Slider
							value={[config.maxViewRadius]}
							onValueChange={([value]) => onConfigChange({ maxViewRadius: value })}
							min={8}
							max={64}
							step={1}
						/>
					</div>

					{/* Default World */}
					<div className="space-y-2">
						<Label htmlFor="defaultWorld">Default World</Label>
						<Input
							id="defaultWorld"
							value={config.defaultWorld}
							onChange={(e) => onConfigChange({ defaultWorld: e.target.value })}
							placeholder="default"
						/>
					</div>

					{/* Default Game Mode */}
					<div className="space-y-2">
						<Label>Default Game Mode</Label>
						<Select
							value={config.defaultGameMode}
							onValueChange={(value: 'Adventure' | 'Creative' | 'Survival') =>
								onConfigChange({ defaultGameMode: value })
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Adventure">Adventure</SelectItem>
								<SelectItem value="Creative">Creative</SelectItem>
								<SelectItem value="Survival">Survival</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
