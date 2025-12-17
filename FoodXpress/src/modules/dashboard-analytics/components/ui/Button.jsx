function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
    secondary: 'bg-[var(--secondary)] text-white hover:opacity-90',
    outline: 'border border-[var(--muted)] bg-transparent hover:bg-[var(--bg)]',
    ghost: 'bg-transparent hover:bg-[var(--bg)]',
    danger: 'bg-[var(--danger)] text-white hover:opacity-90',
    success: 'bg-[var(--success)] text-white hover:opacity-90',
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button


