"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('de')}
        className={`${language === 'de' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        DE
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={`${language === 'en' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        EN
      </Button>
    </div>
  )
} 