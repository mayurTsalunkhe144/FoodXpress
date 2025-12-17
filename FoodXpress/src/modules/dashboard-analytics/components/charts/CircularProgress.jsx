import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function CircularProgress({ value = 65, label = 'Progress', color = '#22D3EE' }) {
  const data = [
    { name: 'progress', value: value },
    { name: 'remaining', value: 100 - value }
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#334155" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <div className="text-3xl font-bold text-white">{value}%</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </div>
  )
}
