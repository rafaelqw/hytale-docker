export function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="w-[340px] shrink-0">
      <div className="h-full bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col">
          <div className="mb-4 p-3 w-fit rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-bold mb-3 text-foreground text-left">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed text-left">{description}</p>
        </div>
      </div>
    </div>
  );
}
