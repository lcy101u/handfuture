import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTranslation } from "@/i18n/catalogs";
import { normalizeLocale, type Locale } from "@/i18n/locales";

export type Language = Locale;

export interface LanguageState {
  currentLanguage: Locale;
  hasExplicitPreference: boolean;
  setLanguage: (language: Locale, explicit?: boolean) => void;
  t: (key: string) => string;
}

type PersistedLanguageState = Pick<
  LanguageState,
  "currentLanguage" | "hasExplicitPreference"
>;

function synchronizeLanguageDocument(language: Locale) {
  document.documentElement.lang = language;
  document.title = getTranslation(language, "app.title");
}

function migrateLanguageState(
  persistedState: unknown,
): PersistedLanguageState {
  const persisted = persistedState as Partial<PersistedLanguageState> & {
    currentLanguage?: unknown;
  };
  const legacyLanguage = persisted.currentLanguage;
  const currentLanguage =
    typeof legacyLanguage === "string"
      ? normalizeLocale(legacyLanguage) ?? "zh-TW"
      : "zh-TW";

  return {
    currentLanguage,
    hasExplicitPreference:
      typeof persisted.hasExplicitPreference === "boolean"
        ? persisted.hasExplicitPreference
        : typeof legacyLanguage === "string",
  };
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: "zh-TW",
      hasExplicitPreference: false,

      setLanguage: (language, explicit = true) => {
        set({ currentLanguage: language, hasExplicitPreference: explicit });
        synchronizeLanguageDocument(language);
      },

      t: (key) => getTranslation(get().currentLanguage, key),
    }),
    {
      name: "language-store",
      version: 1,
      partialize: ({ currentLanguage, hasExplicitPreference }) => ({
        currentLanguage,
        hasExplicitPreference,
      }),
      migrate: (persistedState) => migrateLanguageState(persistedState),
      onRehydrateStorage: () => (state) => {
        if (state) synchronizeLanguageDocument(state.currentLanguage);
      },
    },
  ),
);
