import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import { getUserFromStorage, isAdmin } from '../../utils/auth.js'

function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()
  const user = getUserFromStorage() || { fullName: 'Demo User' }
  
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <nav style={{
      background: 'var(--navbar-bg)',
      borderColor: 'var(--navbar-border)',
      color: 'var(--navbar-text)'
    }} className="fixed top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-4 md:px-8 z-50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg transition-colors hover:bg-opacity-50"
          style={{ color: 'var(--navbar-icon)' }}
          title="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">Food Delivery Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--navbar-icon)' }}
          title="Toggle theme"
        >
          {isDark ? (
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--navbar-icon)' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center transition-transform hover:scale-105"
          >
            <span className="text-white font-bold">{user.fullName?.charAt(0) || 'U'}</span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)'
            }}>
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.fullName}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => {
                    const profilePath = isAdmin(user) ? '/dashboard/admin/profile' : '/dashboard/restaurant/profile'
                    navigate(profilePath)
                    setShowProfileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-red-500/10 transition-colors flex items-center gap-2 text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
