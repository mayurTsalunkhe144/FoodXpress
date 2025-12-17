function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    primary: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    secondary: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
