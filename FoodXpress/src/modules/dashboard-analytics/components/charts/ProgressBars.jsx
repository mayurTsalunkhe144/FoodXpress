export default function ProgressBars({ data }) {
  const items = data && data.length > 0 ? data : [
    { label: 'Completed', value: 85 },
    { label: 'Pending', value: 60 },
    { label: 'Processing', value: 72 },
    { label: 'Cancelled', value: 35 }
  ]

  const colors = ['#22D3EE', '#A855F7', '#EC4899', '#EF4444']
  
  // Calculate max value for scaling
  const maxValue = Math.max(...items.map(item => item.value || 0), 100)

  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
        return (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: colors[index] }}>{item.value}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: colors[index]
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
