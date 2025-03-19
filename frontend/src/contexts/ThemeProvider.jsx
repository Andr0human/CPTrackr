import { useState, useEffect } from 'react';
import ThemeContext from './ThemeContext';

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Use the default theme if no saved preference
      setDarkMode(defaultTheme === 'dark');
      localStorage.setItem('theme', defaultTheme);
    }
  }, [defaultTheme]);

  useEffect(() => {
    // Apply theme to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 