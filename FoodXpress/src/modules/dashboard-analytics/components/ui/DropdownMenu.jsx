import { useState, useRef, useEffect } from 'react'

function DropdownMenu({ trigger, children, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute top-full mt-1 ${alignClasses[align]} z-50 min-w-[200px] bg-[var(--surface)] border border-[var(--muted)] rounded-[var(--radius)] shadow-lg py-1`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownMenuItem({ children, onClick, className = '' }) {
  return (
    <div
      className={`px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg)] cursor-pointer transition-colors ${className}`}
      onClick={() => {
        onClick?.()
      }}
    >
      {children}
    </div>
  )
}

DropdownMenu.Item = DropdownMenuItem

export default DropdownMenu


