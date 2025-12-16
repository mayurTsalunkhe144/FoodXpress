import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const darkMode = saved ? saved === 'dark' : true
    setIsDark(darkMode)
    applyTheme(darkMode)
  }, [])

  const applyTheme = (dark) => {
    // Only apply theme variables, don't modify document.body
    // Theme variables will be scoped to dashboard container
  }

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
      applyTheme(newValue)
      return newValue
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
