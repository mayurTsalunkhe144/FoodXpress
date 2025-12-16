import { useState, useContext } from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { ThemeContext } from '../../context/ThemeContext.jsx'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isDark } = useContext(ThemeContext)

  const themeStyles = isDark ? {
    '--bg-primary': '#1a1a1a',
    '--bg-secondary': '#2d2d2d',
    '--bg-tertiary': '#3a3a3a',
    '--text-primary': '#ffffff',
    '--text-secondary': '#b0b0b0',
    '--text-tertiary': '#808080',
    '--border-color': '#404040',
    '--navbar-bg': 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
    '--navbar-border': '#404040',
    '--navbar-text': '#ffffff',
    '--navbar-icon': '#b0b0b0',
    '--sidebar-bg': 'linear-gradient(to bottom, #0f0f0f, #1a1a1a)',
    '--sidebar-border': '#404040',
    '--sidebar-text': '#b0b0b0',
    '--sidebar-hover': '#2d2d2d',
    '--sidebar-active-bg': 'rgba(255, 77, 77, 0.15)',
    '--sidebar-active-border': '#ff4d4d',
    '--sidebar-active-text': '#ff6b6b',
    backgroundColor: 'linear-gradient(135deg, hsl(10 15 30) 0%, hsl(220 20% 15%) 100%)',
    color: '#ffffff'
  } : {
    '--bg-primary': '#f5f5f5',
    '--bg-secondary': '#ffffff',
    '--bg-tertiary': '#eeeeee',
    '--text-primary': '#111',
    '--text-secondary': '#666',
    '--text-tertiary': '#999',
    '--border-color': '#ddd',
    '--navbar-bg': 'linear-gradient(to right, #ffffff, #f8f9fa)',
    '--navbar-border': '#ddd',
    '--navbar-text': '#111',
    '--navbar-icon': '#666',
    '--sidebar-bg': 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
    '--sidebar-border': '#ddd',
    '--sidebar-text': '#666',
    '--sidebar-hover': '#f4f4f4',
    '--sidebar-active-bg': 'rgba(255, 77, 77, 0.1)',
    '--sidebar-active-border': '#ff4d4d',
    '--sidebar-active-text': '#ff4d4d',
    backgroundColor: '#f5f5f5',
    color: '#111'
  }

  return (
    <div style={themeStyles} className="min-h-screen transition-all duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main style={{ backgroundColor: 'var(--bg-primary)' }} className={`transition-all duration-300 mt-16 p-4 md:p-8 min-h-screen ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
