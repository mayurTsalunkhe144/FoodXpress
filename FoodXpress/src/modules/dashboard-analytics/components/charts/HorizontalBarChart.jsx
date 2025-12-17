import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function HorizontalBarChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Pizza', value: 85 },
    { name: 'Burger', value: 72 },
    { name: 'Pasta', value: 68 },
    { name: 'Salad', value: 55 },
    { name: 'Dessert', value: 48 }
  ]

  const colors = ['#22D3EE', '#A855F7', '#EC4899', '#F59E0B', '#10B981']

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis type="number" stroke="#94A3B8" style={{ fontSize: '12px' }} />
        <YAxis dataKey="name" type="category" stroke="#94A3B8" width={90} style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px' }}
          labelStyle={{ color: '#22D3EE' }}
          cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
        />
        <Bar dataKey="value" fill="#22D3EE" radius={[0, 8, 8, 0]} isAnimationActive={true}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
