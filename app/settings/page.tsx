"use client";

import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/storage";
import { DEFAULT_SETTINGS, UserSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function update(field: keyof UserSettings, value: number) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <main className="px-4 pb-6 pt-8">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Settings
        </p>
        <h1 className="text-xl font-bold text-gray-900">Daily goals</h1>
      </header>

      <div className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm">
        <Field
          label="Daily calorie goal"
          unit="kcal"
          value={settings.dailyCalorieGoal}
          onChange={(v) => update("dailyCalorieGoal", v)}
        />
        <Field
          label="Protein goal"
          unit="g"
          value={settings.proteinGoalG}
          onChange={(v) => update("proteinGoalG", v)}
        />
        <Field
          label="Carbs goal"
          unit="g"
          value={settings.carbsGoalG}
          onChange={(v) => update("carbsGoalG", v)}
        />
        <Field
          label="Fat goal"
          unit="g"
          value={settings.fatGoalG}
          onChange={(v) => update("fatGoalG", v)}
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30"
      >
        {saved ? "Saved ✓" : "Save goals"}
      </button>

      <p className="mt-6 text-center text-xs text-gray-400">
        Your logs and goals are stored only on this device.
      </p>
    </main>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-right text-sm font-semibold text-gray-800 outline-none focus:border-brand-500"
        />
        <span className="text-xs text-gray-400">{unit}</span>
      </span>
    </label>
  );
}
