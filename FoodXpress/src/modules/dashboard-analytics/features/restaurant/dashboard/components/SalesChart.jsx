import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartWrapper from '../../../../components/ui/ChartWrapper.jsx'

function SalesChart({ data = [] }) {
  return (
    <ChartWrapper title="Sales Trend (Last 30 Days)">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--muted)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--muted)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--muted)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--primary)" 
            strokeWidth={2}
            dot={{ fill: 'var(--primary)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default SalesChart


