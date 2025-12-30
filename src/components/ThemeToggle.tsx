import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import useTheme from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Button size="sm" variant="ghost" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

export default ThemeToggle;
