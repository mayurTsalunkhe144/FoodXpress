import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function Modal({ isOpen, onClose, children, title, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
        className={`rounded-2xl shadow-2xl border ${sizes[size]} w-full max-h-[90vh] overflow-y-auto flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div 
            className="px-8 py-6 border-b flex items-center justify-between sticky top-0 z-10"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{ color: 'var(--text-secondary)' }}
              className="hover:text-cyan-400 transition text-3xl leading-none font-light"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal
