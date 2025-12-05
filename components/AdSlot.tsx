import AdBanner from "./AdBanner";

type AdSlotProps = {
  slotId?: string;
  label?: string;
};

export default function AdSlot({
  slotId = "1234567890",
  label = "SPONSOR_01",
}: AdSlotProps) {
  return (
    <div className="col-span-1 bg-[var(--color-neo-yellow)] border-[3px] border-[var(--color-neo-black)] neo-shadow p-4 min-h-[180px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-neo-black)] opacity-70">
          // {label}
        </span>
        <span className="text-xs bg-[var(--color-neo-black)] text-[var(--color-neo-yellow)] px-2 py-1 font-mono">
          AD
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[var(--color-neo-black)] border-opacity-30">
        <AdBanner
          dataAdSlot={slotId}
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
        />
      </div>
    </div>
  );
}
