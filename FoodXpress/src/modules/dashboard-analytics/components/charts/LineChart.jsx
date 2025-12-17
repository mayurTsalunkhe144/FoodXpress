import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SalesLineChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 }
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px' }}
          labelStyle={{ color: '#22D3EE' }}
          cursor={{ stroke: '#22D3EE', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#22D3EE" 
          strokeWidth={3}
          dot={{ fill: '#22D3EE', r: 5 }}
          activeDot={{ r: 7 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
