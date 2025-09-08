
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { useLanguageStore, type Language } from '@/store/language-store'
import { useState, useEffect } from 'react'

const languages = [
  { code: 'zh' as Language, name: '中文', icon: '中' },
  { code: 'en' as Language, name: 'English', icon: 'EN' }
]

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, t } = useLanguageStore()
  const [isChanging, setIsChanging] = useState(false)
  const [displayLanguage, setDisplayLanguage] = useState(currentLanguage)
  
  const currentLang = languages.find(lang => lang.code === displayLanguage)
  
  // Smooth language transition effect
  useEffect(() => {
    if (currentLanguage !== displayLanguage) {
      setIsChanging(true)
      
      // Fade out current language
      setTimeout(() => {
        setDisplayLanguage(currentLanguage)
      }, 150)
      
      // Fade back in with new language
      setTimeout(() => {
        setIsChanging(false)
      }, 300)
    }
  }, [currentLanguage, displayLanguage])
  
  const handleLanguageChange = (language: Language) => {
    if (language !== currentLanguage) {
      // Add visual feedback before changing
      setIsChanging(true)
      
      // Small delay for smooth transition
      setTimeout(() => {
        setLanguage(language)
      }, 100)
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 hover:border-white/30"
        >
          <span 
            className={`text-sm font-bold text-white bg-white/30 px-2 py-1 rounded transition-all duration-300 transform ${
              isChanging ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
            }`}
          >
            {currentLang?.icon}
          </span>
          <span 
            className={`font-medium text-sm transition-all duration-300 ${
              isChanging ? 'opacity-50 translate-x-1' : 'opacity-100 translate-x-0'
            }`}
          >
            {currentLang?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px] bg-white/95 backdrop-blur-sm border-white/20 animate-in slide-in-from-top-2 duration-200 language-dropdown-enter"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`gap-3 cursor-pointer p-3 rounded-md language-item-hover ${
              currentLanguage === language.code 
                ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                : 'hover:bg-amber-50 hover:shadow-sm'
            }`}
          >
            <span 
              className={`text-sm font-bold bg-gray-200/80 text-gray-800 px-2 py-1 rounded transition-all duration-200 ${
                currentLanguage === language.code 
                  ? 'scale-110 bg-primary/80 text-white' 
                  : 'scale-100 hover:scale-105 hover:bg-primary/60 hover:text-white'
              }`}
            >
              {language.icon}
            </span>
            <span className="font-medium transition-colors duration-200">
              {language.name}
            </span>
            {currentLanguage === language.code && (
              <span className="ml-auto text-amber-600 text-xs animate-in fade-in duration-200">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}