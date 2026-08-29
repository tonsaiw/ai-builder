"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CalorieRing from "@/components/CalorieRing";
import MacroBar from "@/components/MacroBar";
import MealListItem from "@/components/MealListItem";
import { deleteEntry, loadEntries, loadSettings } from "@/lib/storage";
import { MealEntry, UserSettings, DEFAULT_SETTINGS } from "@/lib/types";
import { todayKey } from "@/lib/date";

export default function DashboardPage() {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const todayEntries = useMemo(
    () => entries.filter((e) => e.dateKey === todayKey()),
    [entries]
  );

  const totals = useMemo(
    () =>
      todayEntries.reduce(
        (acc, e) => ({
          calories: acc.calories + e.totalCalories,
          protein: acc.protein + e.totalProteinG,
          carbs: acc.carbs + e.totalCarbsG,
          fat: acc.fat + e.totalFatG,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [todayEntries]
  );

  function handleDelete(id: string) {
    setEntries(deleteEntry(id));
  }

  return (
    <main className="px-4 pb-6 pt-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Today
          </p>
          <h1 className="text-xl font-bold text-gray-900">Your nutrition</h1>
        </div>
        <Link
          href="/log"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-xl text-white shadow-lg shadow-brand-600/30"
          aria-label="Log a meal"
        >
          +
        </Link>
      </header>

      {loaded && (
        <>
          <section className="flex flex-col items-center rounded-3xl bg-white p-6 shadow-sm">
            <CalorieRing consumed={totals.calories} goal={settings.dailyCalorieGoal} />
            <div className="mt-6 flex w-full gap-4">
              <MacroBar
                label="Protein"
                value={totals.protein}
                goal={settings.proteinGoalG}
                color="#16a35a"
              />
              <MacroBar
                label="Carbs"
                value={totals.carbs}
                goal={settings.carbsGoalG}
                color="#f59e0b"
              />
              <MacroBar
                label="Fat"
                value={totals.fat}
                goal={settings.fatGoalG}
                color="#3b82f6"
              />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Meals today ({todayEntries.length})
              </h2>
              <Link href="/log" className="text-xs font-semibold text-brand-600">
                + Add meal
              </Link>
            </div>

            {todayEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white/60 py-10 text-center">
                <span className="text-3xl">📸</span>
                <p className="max-w-[220px] text-sm text-gray-500">
                  No meals logged yet today. Snap a photo of your food to get
                  started.
                </p>
                <Link
                  href="/log"
                  className="mt-1 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  Log your first meal
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {todayEntries.map((entry) => (
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
