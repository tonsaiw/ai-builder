"use client";

import { MealEntry } from "@/lib/types";
import { formatTime } from "@/lib/date";

export default function MealListItem({
  entry,
  onDelete,
}: {
  entry: MealEntry;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
      {entry.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.thumbnail}
          alt={entry.mealName}
          className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
          🍽️
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {entry.mealName}
        </p>
        <p className="text-xs text-gray-400">
          {formatTime(entry.timestamp)} · P{Math.round(entry.totalProteinG)}g · C
          {Math.round(entry.totalCarbsG)}g · F{Math.round(entry.totalFatG)}g
        </p>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-bold tabular-nums text-gray-900">
          {Math.round(entry.totalCalories)}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-gray-400">
          kcal
        </span>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="Delete entry"
          className="ml-1 flex-shrink-0 text-gray-300 transition-colors hover:text-red-500"
        >
          ✕
        </button>
      )}
    </div>
  );
}
