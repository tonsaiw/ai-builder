"use client";

import { DEFAULT_SETTINGS, MealEntry, UserSettings } from "./types";

const ENTRIES_KEY = "nutrition-trainer:entries";
const SETTINGS_KEY = "nutrition-trainer:settings";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadEntries(): MealEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MealEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveEntries(entries: MealEntry[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error("Failed to save entries", err);
  }
}

export function addEntry(entry: MealEntry): MealEntry[] {
  const entries = [entry, ...loadEntries()];
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id: string): MealEntry[] {
  const entries = loadEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}

export function loadSettings(): UserSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as UserSettings;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to save settings", err);
  }
}
