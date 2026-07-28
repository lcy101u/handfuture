import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTranslation } from "@/i18n/catalogs";
import { normalizeLocale, type Locale } from "@/i18n/locales";

export type Language = Locale;

export interface LanguageState {
  currentLanguage: Locale;
  preferredLanguage: Locale | null;
  hasExplicitPreference: boolean;
  setLanguage: (language: Locale, explicit?: boolean) => void;
  t: (key: string) => string;
}

type PersistedLanguageState = Pick<
  LanguageState,
  "currentLanguage" | "preferredLanguage" | "hasExplicitPreference"
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
    preferredLanguage?: unknown;
  };
  const legacyLanguage = persisted.currentLanguage;
  const currentLanguage =
    typeof legacyLanguage === "string"
      ? normalizeLocale(legacyLanguage) ?? "zh-TW"
      : "zh-TW";

  const persistedPreferredLanguage =
    typeof persisted.preferredLanguage === "string"
      ? normalizeLocale(persisted.preferredLanguage)
      : null;
  const preferredLanguage =
    persistedPreferredLanguage ??
    (persisted.hasExplicitPreference === false
      ? null
      : typeof legacyLanguage === "string"
        ? currentLanguage
        : null);

  return {
    currentLanguage,
    preferredLanguage,
    hasExplicitPreference: preferredLanguage !== null,
  };
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: "zh-TW",
      preferredLanguage: null,
      hasExplicitPreference: false,

      setLanguage: (language, explicit = true) => {
        set(
          explicit
            ? {
                currentLanguage: language,
                preferredLanguage: language,
                hasExplicitPreference: true,
              }
            : { currentLanguage: language },
        );
        synchronizeLanguageDocument(language);
      },

      t: (key) => getTranslation(get().currentLanguage, key),
    }),
    {
      name: "language-store",
      version: 2,
      partialize: ({
        currentLanguage,
        preferredLanguage,
        hasExplicitPreference,
      }) => ({
        currentLanguage,
        preferredLanguage,
        hasExplicitPreference,
      }),
      migrate: (persistedState) => migrateLanguageState(persistedState),
      onRehydrateStorage: () => (state) => {
        if (state) synchronizeLanguageDocument(state.currentLanguage);
      },
    },
  ),
);
