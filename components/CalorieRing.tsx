"use client";

export default function CalorieRing({
  consumed,
  goal,
}: {
  consumed: number;
  goal: number;
}) {
  const size = 176;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const offset = circumference * (1 - pct);
  const remaining = Math.max(goal - consumed, 0);
  const over = consumed > goal;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={over ? "#ef4444" : "#16a35a"}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums text-gray-900">
          {Math.round(consumed)}
        </span>
        <span className="text-xs font-medium text-gray-400">of {goal} kcal</span>
        <span
          className={`mt-1 text-[11px] font-semibold ${
            over ? "text-red-500" : "text-brand-600"
          }`}
        >
          {over
            ? `${Math.round(consumed - goal)} over`
            : `${Math.round(remaining)} left`}
        </span>
      </div>
    </div>
  );
}
