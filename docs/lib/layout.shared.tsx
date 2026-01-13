import { GithubInfo } from '@/components/github-info';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Github } from 'lucide-react';
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
          <Github />
        ),
        external: true,
        url: 'https://github.com/romariin/hytale-docker',
        text: 'GitHub',
      },
    ],
  };
}
