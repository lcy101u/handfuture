import { Check, Languages } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  beginManualLocaleChange,
  buildSamePageLocalePath,
} from "@/components/routing/locale-routing";
import { LANGUAGE_OPTIONS } from "@/i18n/catalogs";
import type { Locale } from "@/i18n/locales";
import { useLanguageStore } from "@/store/language-store";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export default function LanguageSwitcher() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const t = useLanguageStore((state) => state.t);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentOption = LANGUAGE_OPTIONS.find(
    ({ code }) => code === currentLanguage,
  );

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLanguage) return;
    beginManualLocaleChange(locale);
    navigate(buildSamePageLocalePath(pathname, locale));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={t("language.switch")}
          className="gap-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span className="font-bold">{currentOption?.shortLabel}</span>
          <span className="hidden sm:inline">{currentOption?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[210px]">
        {LANGUAGE_OPTIONS.map((option) => {
          const selected = currentLanguage === option.code;
          return (
            <DropdownMenuItem
              key={option.code}
              aria-current={selected ? "true" : undefined}
              onSelect={() => handleLanguageChange(option.code)}
              className="cursor-pointer gap-3"
            >
              <span className="w-9 text-xs font-bold text-muted-foreground">
                {option.shortLabel}
              </span>
              <span>{option.name}</span>
              {selected && (
                <Check className="ml-auto h-4 w-4" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
