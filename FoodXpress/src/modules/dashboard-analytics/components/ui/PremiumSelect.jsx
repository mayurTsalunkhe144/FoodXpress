import { useState, useRef, useEffect } from 'react'

export default function PremiumSelect({ value, onChange, options, label, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          borderColor: isOpen ? 'var(--primary-red)' : 'var(--border-color)',
          opacity: disabled ? 0.5 : 1
        }}
        className="w-full px-4 py-2 rounded-lg font-semibold border transition flex justify-between items-center disabled:cursor-not-allowed"
      >
        <span>{selectedOption?.label || label}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--primary-red)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
          className="absolute top-full left-0 right-0 mt-2 border rounded-lg z-50"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              style={{
                backgroundColor: value === option.value ? 'var(--primary-red)' : 'transparent',
                color: value === option.value ? 'white' : 'var(--text-primary)'
              }}
              className="w-full px-4 py-2 text-left hover:bg-opacity-80 transition first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
