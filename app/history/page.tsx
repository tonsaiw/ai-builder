"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteEntry, loadEntries, loadSettings } from "@/lib/storage";
import { MealEntry, UserSettings, DEFAULT_SETTINGS } from "@/lib/types";
import { formatDateLabel, lastNDateKeys } from "@/lib/date";
import MealListItem from "@/components/MealListItem";

export default function HistoryPage() {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const last7 = useMemo(() => lastNDateKeys(7), []);

  const totalsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const key of last7) map.set(key, 0);
    for (const e of entries) {
      if (map.has(e.dateKey)) {
        map.set(e.dateKey, (map.get(e.dateKey) ?? 0) + e.totalCalories);
      }
    }
    return map;
  }, [entries, last7]);

  const maxCalories = Math.max(
    settings.dailyCalorieGoal,
    ...Array.from(totalsByDay.values())
  );

  const activeDate = selectedDate || last7[last7.length - 1];
  const dayEntries = entries
    .filter((e) => e.dateKey === activeDate)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const dayTotal = dayEntries.reduce((sum, e) => sum + e.totalCalories, 0);

  function handleDelete(id: string) {
    setEntries(deleteEntry(id));
  }

  return (
    <main className="px-4 pb-6 pt-8">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          History
        </p>
        <h1 className="text-xl font-bold text-gray-900">Last 7 days</h1>
      </header>

      {loaded && (
        <>
          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
              {last7.map((key) => {
                const cals = totalsByDay.get(key) ?? 0;
                const heightPct = maxCalories > 0 ? Math.max((cals / maxCalories) * 100, 4) : 4;
                const isActive = key === activeDate;
                const isOver = cals > settings.dailyCalorieGoal;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-semibold tabular-nums text-gray-400">
                      {cals > 0 ? Math.round(cals) : ""}
                    </span>
                    <div className="flex h-24 w-full items-end">
                      <div
                        className={`w-full rounded-full transition-all ${
                          isActive
                            ? isOver
                              ? "bg-red-500"
                              : "bg-brand-600"
                            : "bg-gray-200"
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isActive ? "text-brand-700" : "text-gray-400"
                      }`}
                    >
                      {formatDateLabel(key).slice(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400">
              <span className="h-2 w-2 rounded-full bg-gray-300" /> goal: {settings.dailyCalorieGoal} kcal
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                {formatDateLabel(activeDate)} · {Math.round(dayTotal)} kcal
              </h2>
            </div>

            {dayEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 py-10 text-center text-sm text-gray-400">
                No meals logged this day.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {dayEntries.map((entry) => (
                  <MealListItem key={entry.id} entry={entry} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
