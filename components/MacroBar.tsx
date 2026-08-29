"use client";

export default function MacroBar({
  label,
  value,
  goal,
  color,
  unit = "g",
}: {
  label: string;
  value: number;
  goal: number;
  color: string;
  unit?: string;
}) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  return (
    <div className="flex-1">
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-gray-500">{label}</span>
        <span className="tabular-nums text-gray-400">
          {Math.round(value)}/{Math.round(goal)}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
