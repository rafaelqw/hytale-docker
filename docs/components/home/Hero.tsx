'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Github, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackgroundImage } from './BackgroundImage';

export function Hero() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/romariin/hytale-docker')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(null));
  }, []);

  return (
    <div className="relative overflow-hidden">
      <BackgroundImage />
      <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 py-24 mx-auto px-4 min-h-[70vh]">
        <div className="flex flex-col items-start text-left gap-6 md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            Hytale Docker
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-muted-foreground leading-relaxed"
        >
          Production-ready Docker container for Hytale dedicated servers.
          Automated authentication, auto-updates, and secure by default.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4 items-center mt-2"
        >
          <Link href="/docs">
            <Button size="lg" className="rounded-md text-base h-11 px-8 gap-2 shadow-lg">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="https://github.com/romariin/hytale-docker">
            <Button variant="outline" size="lg" className="rounded-md text-base h-11 px-8 gap-2 shadow-sm bg-background/50 backdrop-blur-sm">
              <Github className="w-4 h-4" /> GitHub
              {stars !== null && (
                <span className="flex items-center gap-1 ml-1 text-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {stars.toLocaleString()}
                </span>
              )}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="md:w-1/2 flex justify-center md:justify-end"
      >
        <Image
          src="/logo.png"
          alt="Hytale Docker Logo"
          width={500}
          height={500}
          className="w-full max-w-[500px] h-auto drop-shadow-2xl"
          priority
        />
      </motion.div>
      </div>
    </div>
  );
}
