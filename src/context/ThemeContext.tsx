import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  xColor: string;
  oColor: string;
  shadow: string;
}

interface Theme {
  light: ThemeColors;
  dark: ThemeColors;
  easy: ThemeColors;
  medium: ThemeColors;
  hard: ThemeColors;
  impossible: ThemeColors;
}

const themes: Theme = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#2196F3',
    xColor: '#FF6B6B',
    oColor: '#4ECDC4',
    shadow: 'rgba(0, 0, 0, 0.2)'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#64B5F6',
    xColor: '#FF8585',
    oColor: '#66FFE5',
    shadow: 'rgba(0, 0, 0, 0.4)'
  },
  easy: {
    background: '#e8f5e9',
    text: '#000000',
    primary: '#4CAF50',
    xColor: '#FF6B6B',
    oColor: '#4ECDC4',
    shadow: 'rgba(76, 175, 80, 0.2)'
  },
  medium: {
    background: '#e3f2fd',
    text: '#000000',
    primary: '#2196F3',
    xColor: '#FF6B6B',
    oColor: '#4ECDC4',
    shadow: 'rgba(33, 150, 243, 0.2)'
  },
  hard: {
    background: '#fff3e0',
    text: '#000000',
    primary: '#FF9800',
    xColor: '#FF6B6B',
    oColor: '#4ECDC4',
    shadow: 'rgba(255, 152, 0, 0.2)'
  },
  impossible: {
    background: '#fce4ec',
    text: '#000000',
    primary: '#e91e63',
    xColor: '#FF6B6B',
    oColor: '#4ECDC4',
    shadow: 'rgba(233, 30, 99, 0.2)'
  }
};

interface ThemeContextType {
  theme: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDifficultyTheme: (difficulty: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(themes.easy);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const setDifficultyTheme = (difficulty: string) => {
    const newTheme = themes[difficulty as keyof typeof themes] || themes.easy;
    setCurrentTheme(newTheme);
    updateCSSVariables(newTheme);
  };

  const updateCSSVariables = (theme: ThemeColors) => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  };

  // Set initial CSS variables
  React.useEffect(() => {
    updateCSSVariables(currentTheme);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setCurrentTheme(isDarkMode ? themes.light : themes.dark);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme,
      isDarkMode,
      toggleTheme,
      setDifficultyTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 