import Image from 'next/image';

export function BackgroundImage() {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src="/Hytale-Release-Time-Header.webp"
        alt="Hytale Background"
        fill
        className="object-cover opacity-50 dark:opacity-40 blur-sm scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
    </div>
  );
}
