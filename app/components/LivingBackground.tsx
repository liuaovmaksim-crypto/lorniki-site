import { Settings } from "./config";

export default function LivingBackground({
  isLight,
  settings,
}: {
  isLight: boolean;
  settings: Settings;
}) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className={
          isLight
            ? "absolute inset-0 bg-[radial-gradient(circle_at_75%_16%,#ffffff88,transparent_12%),radial-gradient(circle_at_20%_70%,#fb718555,transparent_35%),linear-gradient(to_bottom,#f3ede7,#e9ddd4_55%,#d8c8bf)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_75%_16%,#e0f2fe22,transparent_12%),radial-gradient(circle_at_20%_70%,#7f1d1d55,transparent_35%),linear-gradient(to_bottom,#030203,#100509_55%,#010101)]"
        }
      />

      {settings.background !== "clean" && (
        <>
          <div className="absolute right-[12%] top-[8%] h-60 w-60 rounded-full border border-white/10 bg-white/[0.03]" />

          <div className="absolute inset-x-[-45%] top-[12%] h-40 animate-mist bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-[var(--fog)] blur-3xl" />
          <div className="absolute inset-x-[-45%] top-[48%] h-44 animate-mist-reverse bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-[calc(var(--fog)*0.14)] blur-3xl" />
          <div className="absolute inset-x-[-45%] top-[72%] h-36 animate-mist-slow bg-gradient-to-r from-transparent via-[var(--second)] to-transparent opacity-[calc(var(--fog)*0.12)] blur-3xl" />
        </>
      )}

      {settings.particles > 0 && (
        <ParticleRain
          type={settings.particleType}
          amount={Math.max(8, Math.round(settings.particles / 4))}
        />
      )}

      <div
        className={
          isLight
            ? "absolute inset-0 bg-gradient-to-b from-white/5 via-white/5 to-white/20"
            : "absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/80"
        }
      />
    </div>
  );
}

function ParticleRain({
  type,
  amount,
}: {
  type: Settings["particleType"];
  amount: number;
}) {
  const symbols =
    type === "snow"
      ? ["❄", "❅", "✦", "✧"]
      : type === "butterflies"
      ? ["🦋", "🦋", "🦋", "✧"]
      : type === "petals"
      ? ["❀", "✿", "❁", "•"]
      : ["❄", "✦", "❀", "🦋", "✧", "✿"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: amount }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = -((i * 1.7) % 14);
        const duration = 10 + (i % 7);
        const size = 14 + (i % 5) * 4;
        const drift = -70 + (i % 8) * 20;

        return (
          <span
            key={i}
            className="particle-fall absolute -top-12 select-none text-white/60 drop-shadow-[0_0_10px_var(--accent)]"
            style={
              {
                left: `${left}%`,
                fontSize: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                "--drift": `${drift}px`,
                "--rotate": `${180 + i * 37}deg`,
              } as React.CSSProperties
            }
          >
            {symbols[i % symbols.length]}
          </span>
        );
      })}
    </div>
  );
}