function ChartWrapper({ title, children, className = '' }) {
  return (
    <div className={`bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--muted)] p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
          {title}
        </h3>
      )}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}

export default ChartWrapper


