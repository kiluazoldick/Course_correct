import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import type { Language } from '@/lib/i18n/translations';

interface LanguageToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
}

export function LanguageToggle({ variant = 'ghost', showLabel = false }: LanguageToggleProps) {
  const { language, setLanguage } = useTranslation();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={showLabel ? 'default' : 'icon'} data-testid="button-language-toggle">
          <Globe className="h-4 w-4" />
          {showLabel && <span className="ml-2">{currentLang.label}</span>}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
            data-testid={`button-lang-${lang.code}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
