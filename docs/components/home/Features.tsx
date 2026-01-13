'use client';

import { motion } from 'motion/react';
import { 
  Rocket, 
  Lock, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Database 
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function Features() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full overflow-hidden py-24 relative bg-background"
    >
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-background via-background/90 via-30% via-background/60 via-60% to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-background via-background/90 via-30% via-background/60 via-60% to-transparent pointer-events-none z-10" />
      
      <motion.div
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
        className="flex gap-6 px-4"
      >
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex gap-6 shrink-0">
            <FeatureCard 
              icon={<Rocket className="w-8 h-8" />}
              title="One-command startup" 
              description="Just docker compose up. Authenticate once via device code flow, and play forever with persistent sessions." 
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8" />}
              title="Automated OAuth2" 
              description="Handles Hytale's device code authentication flow automatically with 30-day token persistence." 
            />
            <FeatureCard 
              icon={<RefreshCw className="w-8 h-8" />}
              title="Auto-updates" 
              description="Checks for server updates on startup and downloads them automatically using the official Hytale downloader." 
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Secure by default" 
              description="Runs as a non-root user with dropped capabilities and read-only root filesystem for maximum security." 
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Fast boot" 
              description="Optimized Java 25 runtime with AOT cache support for lightning-fast server startups." 
            />
            <FeatureCard 
              icon={<Database className="w-8 h-8" />}
              title="Persistent data" 
              description="Worlds, mods, logs, and configuration are stored in named volumes to survive container restarts." 
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
