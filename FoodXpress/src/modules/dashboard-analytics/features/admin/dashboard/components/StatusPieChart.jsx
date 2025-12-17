import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import ChartWrapper from '../../../../components/ui/ChartWrapper.jsx'

const COLORS = ['var(--success)', 'var(--secondary)', 'var(--danger)']

function StatusPieChart({ data = [] }) {
  const chartData = [
    { name: 'Active', value: data.activeCount || 0 },
    { name: 'Pending', value: data.pendingCount || 0 },
    { name: 'Rejected', value: data.rejectedCount || 0 },
  ]

  return (
    <ChartWrapper title="Restaurant Status Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--muted)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default StatusPieChart


