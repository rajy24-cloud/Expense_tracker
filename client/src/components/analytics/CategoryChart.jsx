import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '../../utils/formatters'
import { CHART_COLORS, getCategoryColor } from '../../constants/categories'

const CustomTooltip = ({ active, payload, currency }) => {
  if (!active || !payload?.length) return null
  const { name, value, percent } = payload[0]
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-300">{name}</p>
      <p className="text-slate-500">{formatCurrency(value, currency)}</p>
      {percent != null && (
        <p className="text-slate-400">{(percent * 100).toFixed(1)}%</p>
      )}
    </div>
  )
}

export default function CategoryChart({ data = [], loading, currency = 'INR' }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="h-5 w-40 skeleton rounded mb-4" />
        <div className="h-[240px] skeleton rounded-xl" />
      </div>
    )
  }

  const chartData = data
    .map(c => ({ name: c.category || c.name, value: c.total || c.amount || 0 }))
    .filter(c => c.value > 0)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-4">Category Breakdown</h3>
      {chartData.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
          No expense data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getCategoryColor(entry.name) || CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend formatter={(v) => <span className="text-xs text-slate-500 dark:text-slate-400">{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
