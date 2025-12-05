export default function Marquee() {
  const text =
    "FILES CONVERTED: 10,420 // SERVER STATUS: ON FIRE 🔥 // DON'T UPLOAD SENSITIVE DATA // COOKIES: DELICIOUS // UPTIME: 99.9% // BUILT DIFFERENT // ";

  return (
    <div className="w-full bg-[var(--color-neo-black)] text-[var(--color-neo-yellow)] py-2 overflow-hidden border-b-[3px] border-[var(--color-neo-black)]">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-4 text-sm font-mono uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-4 text-sm font-mono uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-4 text-sm font-mono uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-4 text-sm font-mono uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}
