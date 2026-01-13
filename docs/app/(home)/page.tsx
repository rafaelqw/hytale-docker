import { BackgroundImage } from '@/components/home/BackgroundImage';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center relative overflow-hidden">
      <Hero />
      <Features />
    </main>
  );
}
