type NeoCardProps = {
  title: string;
  icon: string;
  description?: string;
  status?: string;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
};

export default function NeoCard({
  title,
  icon,
  description,
  status = "SYSTEM_READY",
  onClick,
  size = "medium",
}: NeoCardProps) {
  const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-1",
    large: "col-span-1 md:col-span-2",
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        bg-[var(--color-neo-white)]
        border-[3px] border-[var(--color-neo-black)]
        neo-shadow
        hover:translate-x-[3px] hover:translate-y-[3px] hover:neo-shadow-pressed
        transition-all duration-150 ease-in-out
        p-6 cursor-pointer
        group
        flex flex-col justify-between
        min-h-[180px]
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-4xl">{icon}</span>
        <span className="text-2xl group-hover:rotate-45 transition-transform duration-200">
          ↗
        </span>
      </div>
      <div>
        <h3
          className="font-bold text-xl md:text-2xl uppercase tracking-tighter"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
        <p className="text-xs text-gray-400 mt-2 font-mono">// {status}</p>
      </div>
    </div>
  );
}
