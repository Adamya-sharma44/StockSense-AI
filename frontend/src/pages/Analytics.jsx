import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { analyticsApi } from '../services/api'

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#06b6d4', '#ec4899', '#eab308']

const Analytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await analyticsApi.overview()
        setData(data)
      } catch (err) {
        console.error('Analytics error', err)
        const msg = err.response?.data?.message || 'Failed to load analytics'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categoryData = data
    ? Object.entries(data.categoryBreakdown || {}).map(([name, value]) => ({ name, value }))
    : []

  return (
    <div className="analytics-grid">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Inventory overview</h2>
            <p>High-level metrics across your catalogue.</p>
          </div>
        </header>
        {loading ? (
          <div className="centered">
            <p>Loading analytics…</p>
          </div>
        ) : error ? (
          <div className="error-banner">{error}</div>
        ) : !data ? (
          <p className="empty-state">No analytics data available yet.</p>
        ) : (
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Total SKUs</span>
              <span className="kpi-value">{data.summary.totalSkus}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Total stock units</span>
              <span className="kpi-value">{data.summary.totalStockUnits}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Stock value</span>
              <span className="kpi-value">
                ${Number(data.summary.stockValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        )}
      </section>
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Monthly sales trend</h2>
            <p>Aggregated quantity sold across all SKUs.</p>
          </div>
        </header>
        {loading ? (
          <div className="centered">
            <p>Loading chart…</p>
          </div>
        ) : !data || (data.monthlySales || []).length === 0 ? (
          <p className="empty-state">
            No sales data yet. Once you add sales history to items, trends will appear here.
          </p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.monthlySales}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Stock by category</h2>
            <p>Where your current on-hand units sit.</p>
          </div>
        </header>
        {loading ? (
          <div className="centered">
            <p>Loading breakdown…</p>
          </div>
        ) : categoryData.length === 0 ? (
          <p className="empty-state">Add items with categories to see distribution.</p>
        ) : (
          <div className="chart-container chart-row">
            <ResponsiveContainer width="50%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="legend-list">
              {categoryData.map((entry, index) => (
                <li key={entry.name}>
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="legend-label">{entry.name}</span>
                  <span className="legend-value">{entry.value} units</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

export default Analytics

