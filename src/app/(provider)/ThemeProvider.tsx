"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEY } from "@/shared/utils/theme/theme";
import { setTheme } from "@/shared/utils/theme/theme";
import { THEME_DATA_DEFAULT } from "@/shared/utils/theme/themeOption";
import { Theme } from "@/shared/utils/theme/type";

interface ThemeContextType {
  themeData: Theme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeData, setCurrentTheme] = useState<Theme>(THEME_DATA_DEFAULT);

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme) {
      setCurrentTheme(JSON.parse(storedTheme));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(THEME_DATA_DEFAULT));
    }
  }, []);

  useEffect(() => {
    setTheme(themeData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themeData));
  }, [themeData]);

  return (
    <ThemeContext.Provider value={{ themeData, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
