import { darkTheme, lightTheme } from '@/style/Theme';
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

interface ThemeContextType {
  themeMode: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const GlobalThemeProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [themeMode, setThemeMode] = useState('lightMode');

  //로컬스토리지에 저장된 테마가 없으면 lightTheme으로 설정
  useEffect(() => {
    const currentTheme = window.localStorage.getItem('theme');
    setThemeMode(currentTheme || 'lightMode');
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === 'lightMode' ? 'darkMode' : 'lightMode';
    setThemeMode(newTheme);
    window.localStorage.setItem('theme', newTheme);
  };

  const selectedTheme = themeMode === 'lightMode' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={selectedTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
