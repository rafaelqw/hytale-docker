'use client';

interface MemoryBarProps {
	memoryMin: number;
	memoryMax: number;
	memoryLimit: number;
}

export function MemoryBar({ memoryMin, memoryMax, memoryLimit }: MemoryBarProps) {
	const getWidth = (value: number) => `${(value / memoryLimit) * 100}%`;

	return (
		<div className="space-y-3">
			{/* Visual Memory Bar */}
			<div className="relative h-8 bg-muted rounded-lg overflow-hidden border">
				{/* Container limit background */}
				<div
					className="absolute inset-y-0 left-0 bg-blue-500/30 transition-all duration-300"
					style={{ width: getWidth(memoryLimit) }}
				/>
				{/* Max memory (Xmx) */}
				<div
					className="absolute inset-y-0 left-0 bg-primary/60 transition-all duration-300"
					style={{ width: getWidth(memoryMax) }}
				/>
				{/* Min memory (Xms) */}
				<div
					className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
					style={{ width: getWidth(memoryMin) }}
				/>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-4 text-xs">
				<div className="flex items-center gap-1.5">
					<div className="w-3 h-3 rounded bg-primary" />
					<span className="text-muted-foreground">Initial Heap (Xms)</span>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="w-3 h-3 rounded bg-primary/60" />
					<span className="text-muted-foreground">Max Heap (Xmx)</span>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="w-3 h-3 rounded bg-blue-500/30 border" />
					<span className="text-muted-foreground">Container Limit</span>
				</div>
			</div>
		</div>
	);
}
