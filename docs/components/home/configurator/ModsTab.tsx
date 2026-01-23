'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/styled-tabs';
import { CurseForgeTab } from './CurseForgeTab';
import { ModtaleTab } from './ModtaleTab';
import type { ConfigState } from './types';

interface ModsTabProps {
	config: ConfigState;
	onConfigChange: (updates: Partial<ConfigState>) => void;
}

export function ModsTab({ config, onConfigChange }: ModsTabProps) {
	return (
		<Tabs defaultValue="curseforge" className="flex flex-col flex-1 min-h-0">
			<TabsList className="w-full grid grid-cols-2 shrink-0">
				<TabsTrigger value="curseforge">CurseForge</TabsTrigger>
				<TabsTrigger value="modtale">Modtale</TabsTrigger>
			</TabsList>

			<TabsContent value="curseforge" className="flex flex-col flex-1 min-h-0 mt-0">
				<CurseForgeTab config={config} onConfigChange={onConfigChange} />
			</TabsContent>

			<TabsContent value="modtale" className="flex flex-col flex-1 min-h-0 mt-0">
				<ModtaleTab config={config} onConfigChange={onConfigChange} />
			</TabsContent>
		</Tabs>
	);
}
