"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { resizeImage } from "@/lib/image";
import { addEntry } from "@/lib/storage";
import { MealEntry, NutritionAnalysis } from "@/lib/types";
import { todayKey } from "@/lib/date";

type Status = "idle" | "preview" | "analyzing" | "result" | "error";

export default function LogMealPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<
    (NutritionAnalysis & { mealName: string }) | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      setStatus("error");
      return;
    }

    setStatus("analyzing");
    setErrorMessage("");

    try {
      const [preview, forApi] = await Promise.all([
        resizeImage(file, 480, 0.7),
        resizeImage(file, 1024, 0.85),
      ]);
      setImageDataUrl(preview.dataUrl);

      const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64: forApi.base64,
          mediaType: forApi.mediaType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong analyzing the photo.");
      }

      setAnalysis(data.analysis);
      setStatus("result");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to analyze the photo."
      );
      setStatus("error");
    }
  }

  function updateField(field: "totalCalories" | "totalProteinG" | "totalCarbsG" | "totalFatG", value: number) {
    if (!analysis) return;
    setAnalysis({ ...analysis, [field]: value });
  }

  function handleSave() {
    if (!analysis) return;
    setSaving(true);
    const now = new Date();
    const entry: MealEntry = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: now.toISOString(),
      dateKey: todayKey(),
      thumbnail: imageDataUrl,
      mealName: analysis.mealName || "Meal",
      items: analysis.items,
      totalCalories: Number(analysis.totalCalories) || 0,
      totalProteinG: Number(analysis.totalProteinG) || 0,
      totalCarbsG: Number(analysis.totalCarbsG) || 0,
      totalFatG: Number(analysis.totalFatG) || 0,
      notes: analysis.notes,
    };
    addEntry(entry);
    router.push("/");
  }

  function reset() {
    setStatus("idle");
    setImageDataUrl("");
    setAnalysis(null);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <main className="px-4 pb-6 pt-8">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Log meal
        </p>
        <h1 className="text-xl font-bold text-gray-900">Snap your food</h1>
      </header>

      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gray-300 bg-white/60 py-14 text-center">
          <span className="text-4xl">📷</span>
          <p className="max-w-[240px] text-sm text-gray-500">
            Take a photo of your meal and I&apos;ll estimate the calories and
            nutrition for you.
          </p>
          <div className="flex gap-3">
            <label className="cursor-pointer rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30">
              Take photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            <label className="cursor-pointer rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>
      )}

      {status === "analyzing" && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white py-14 text-center shadow-sm">
          {imageDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageDataUrl}
              alt="Meal preview"
              className="h-40 w-40 rounded-2xl object-cover"
            />
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            Analyzing nutrition...
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white py-10 text-center shadow-sm">
          <span className="text-3xl">⚠️</span>
          <p className="max-w-[240px] text-sm text-red-500">{errorMessage}</p>
          <button
            onClick={reset}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {status === "result" && analysis && (
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {imageDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageDataUrl}
                alt="Meal"
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4">
              <input
                value={analysis.mealName}
                onChange={(e) =>
                  setAnalysis({ ...analysis, mealName: e.target.value })
                }
                className="w-full border-none bg-transparent text-lg font-bold text-gray-900 outline-none"
              />
              {analysis.notes && (
                <p className="mt-1 text-xs text-gray-400">{analysis.notes}</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Detected items
            </h3>
            <div className="flex flex-col gap-2">
              {analysis.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.servingDescription}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-gray-700">
                    {Math.round(item.calories)} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Totals (tap to adjust)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <EditableStat
                label="Calories"
                value={analysis.totalCalories}
                unit="kcal"
                onChange={(v) => updateField("totalCalories", v)}
              />
              <EditableStat
                label="Protein"
                value={analysis.totalProteinG}
                unit="g"
                onChange={(v) => updateField("totalProteinG", v)}
              />
              <EditableStat
                label="Carbs"
                value={analysis.totalCarbsG}
                unit="g"
                onChange={(v) => updateField("totalCarbsG", v)}
              />
              <EditableStat
                label="Fat"
                value={analysis.totalFatG}
                unit="g"
                onChange={(v) => updateField("totalFatG", v)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-700"
            >
              Retake
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save to log"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function EditableStat({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="rounded-xl bg-gray-50 px-3 py-2">
      <span className="block text-xs text-gray-400">{label}</span>
      <span className="flex items-baseline gap-1">
        <input
          type="number"
          value={Math.round(value)}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-16 border-none bg-transparent text-base font-semibold text-gray-800 outline-none"
        />
        <span className="text-xs text-gray-400">{unit}</span>
      </span>
    </label>
  );
}
