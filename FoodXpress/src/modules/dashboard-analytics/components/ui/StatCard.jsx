function StatCard({ title, value, icon, color = 'from-cyan-500 to-blue-500', trend }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
      color: 'var(--text-primary)'
    }} className="group relative overflow-hidden rounded-2xl border p-6 hover:shadow-lg transition-all duration-300">
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">{title}</p>
            <p className="text-4xl font-bold mt-2">{value}</p>
            {trend && <p className="text-xs text-green-400 mt-1">↑ {trend}</p>}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
