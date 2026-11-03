import { createContext, useContext, useState, useEffect } from "react";

const darkmode = createContext();

export function DarkMode({ children }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("tema") !== "light"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("tema", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <darkmode.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </darkmode.Provider>
  );
}

export const useTheme = () => useContext(darkmode);