import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersBarChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Mon', orders: 40 },
    { name: 'Tue', orders: 30 },
    { name: 'Wed', orders: 20 },
    { name: 'Thu', orders: 27 },
    { name: 'Fri', orders: 35 },
    { name: 'Sat', orders: 45 },
    { name: 'Sun', orders: 38 }
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px' }}
          labelStyle={{ color: '#22D3EE' }}
          cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
        />
        <Bar dataKey="orders" fill="#A855F7" radius={[8, 8, 0, 0]} isAnimationActive={true} />
      </BarChart>
    </ResponsiveContainer>
  )
}
