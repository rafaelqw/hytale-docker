import { GithubInfo } from '@/components/github-info';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Cuboid, Github, MessageCircleQuestionMark } from 'lucide-react';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <><Image 
            src="/logo.png" 
            alt="Hytale Docker Logo" 
            width={48} 
            height={48} 
            className="rounded"
          />
            Hytale Docker
          </>,
      enabled: false,
    },
    links: [
      {
        icon: (
          <MessageCircleQuestionMark />
        ),
        external: true,
        url: 'https://discord.gg/FewwuUFqbw',
        text: 'Support (Discord)',
      },
      {
        icon: (
          <Github />
        ),
        external: true,
        url: 'https://github.com/romariin/hytale-docker',
        text: 'GitHub',
      },
      {
        icon: (
          <Cuboid />
        ),
        external: true,
        url: 'https://hub.docker.com/r/rxmarin/hytale-docker',
        text: 'Docker Hub',
      },
    ],
  };
}
