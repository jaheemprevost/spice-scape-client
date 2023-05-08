import { useState, useEffect, createContext } from 'react';

export const ThemeContext = createContext({});

export const ThemeProvider = (props) => {
  const [theme, setTheme] = useState('light');
  

  useEffect(() => { 
    const theme = localStorage.getItem('theme');

    if (theme) {
      setTheme(theme);
    } 
  }, [])

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {props.children}
    </ThemeContext.Provider>
  ); 
};
