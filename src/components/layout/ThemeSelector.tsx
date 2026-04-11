import React from 'react';
import useTheme from '@/hooks/useTheme';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      aria-label="Theme selector"
      value={theme}
      onChange={(e) => setTheme(e.target.value as any)}
      className="text-sm rounded-md border border-input bg-background px-2 py-1 text-muted-foreground"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}

export default ThemeSelector;
