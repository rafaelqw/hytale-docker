'use client';

import { Cpu, HardDrive, Server, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { MemoryBar } from './MemoryBar';
import type { ConfigState } from './types';

interface ResourcesTabProps {
	config: ConfigState;
	onConfigChange: (updates: Partial<ConfigState>) => void;
}

export function ResourcesTab({ config, onConfigChange }: ResourcesTabProps) {
	return (
		<div className="space-y-6 mt-4">
			{/* Memory Visualization */}
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
			</div>

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
					onValueChange={([value]) =>
						onConfigChange({ memoryLimit: value })
					}
					min={config.memoryMax}
					max={64}
					step={1}
				/>
				<p className="text-xs text-muted-foreground">Recommended: Xmx + 2GB for JVM overhead</p>
			</div>
		</div>
	);
}
