import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'lo' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4"
    >
      <Globe className="h-4 w-4" />
      {i18n.language === 'en' ? 'ພາສາລາວ' : 'English'}
    </Button>
  );
}; 