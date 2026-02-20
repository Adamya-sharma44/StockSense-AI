import { useEffect, useState } from 'react'
import { aiApi, analyticsApi, inventoryApi } from '../services/api'
import InventoryForm from '../components/InventoryForm'

const Dashboard = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [lowStock, setLowStock] = useState([])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [invRes, lowRes] = await Promise.all([inventoryApi.list(), inventoryApi.lowStock()])
      setItems(invRes.data)
      setLowStock(lowRes.data)
    } catch (err) {
      console.error('Load dashboard error', err)
      setError('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateOrUpdate = async (data) => {
    setSaving(true)
    setError('')
    try {
      if (editingItem) {
        await inventoryApi.update(editingItem._id, data)
      } else {
        await inventoryApi.create(data)
      }
      setEditingItem(null)
      await loadData()
    } catch (err) {
      console.error('Save item error', err)
      const msg = err.response?.data?.message || 'Failed to save item'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await inventoryApi.remove(id)
      await loadData()
    } catch (err) {
      console.error('Delete error', err)
      setError('Failed to delete item')
    }
  }

  const handleGenerateAI = async () => {
    setAiLoading(true)
    setError('')
    try {
      const { data } = await aiApi.recommendations()
      setAiRecommendations(data.recommendations || [])
    } catch (err) {
      console.error('AI error', err)
      const msg = err.response?.data?.message || 'Failed to generate recommendations'
      setError(msg)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>Inventory</h2>
            <p>Manage products, stock levels, and reorder thresholds.</p>
          </div>
          <button className="btn-secondary" onClick={() => setEditingItem(null)}>
            + New item
          </button>
        </header>
        {error && <div className="error-banner">{error}</div>}
        <InventoryForm
          onSubmit={handleCreateOrUpdate}
          loading={saving}
          initialItem={editingItem}
          onCancel={() => setEditingItem(null)}
        />
        <div className="table-wrapper">
          {loading ? (
            <div className="centered">
              <p>Loading inventory…</p>
            </div>
          ) : items.length === 0 ? (
            <p className="empty-state">
              No items yet. Start by adding a product above to let StockSense AI learn your demand
              patterns.
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Reorder level</th>
                  <th>Reorder qty</th>
                  <th>Unit price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isLow = item.currentStock <= item.reorderLevel
                  return (
                    <tr key={item._id} className={isLow ? 'row-low' : ''}>
                      <td>{item.name}</td>
                      <td>{item.sku}</td>
                      <td>{item.category}</td>
                      <td>{item.currentStock}</td>
                      <td>{item.reorderLevel}</td>
                      <td>{item.reorderQuantity}</td>
                      <td>${item.unitPrice?.toFixed(2)}</td>
                      <td className="row-actions">
                        <button
                          className="link-button"
                          onClick={() => setEditingItem(item)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="link-button danger"
                          onClick={() => handleDelete(item._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>AI recommendations</h2>
            <p>Let the model surface risks and restocking suggestions.</p>
          </div>
          <button className="btn-primary" onClick={handleGenerateAI} disabled={aiLoading || loading}>
            {aiLoading ? 'Analyzing…' : 'Generate insights'}
          </button>
        </header>
        {aiRecommendations.length === 0 ? (
          <p className="empty-state">
            Run AI analysis after you have some inventory and sales history data.
          </p>
        ) : (
          <div className="cards-grid">
            {aiRecommendations.map((rec) => (
              <article key={rec.sku} className={`card card-risk-${rec.riskLevel || 'medium'}`}>
                <header className="card-header">
                  <h3>{rec.sku}</h3>
                  <span className="badge">{rec.riskLevel}</span>
                </header>
                <p className="card-main">{rec.recommendation}</p>
                <p className="card-meta">
                  Suggested reorder: <strong>{rec.suggestedReorderQuantity}</strong> units
                </p>
                <p className="card-footer">{rec.reasoning}</p>
              </article>
            ))}
          </div>
        )}
        <div className="panel-separator" />
        <header className="panel-header compact">
          <div>
            <h3>Low-stock alerts</h3>
            <p>SKUs currently at or below their reorder thresholds.</p>
          </div>
        </header>
        {lowStock.length === 0 ? (
          <p className="empty-state">You&apos;re all clear—no low-stock items right now.</p>
        ) : (
          <ul className="pill-list">
            {lowStock.map((item) => (
              <li key={item._id} className="pill pill-warning">
                <span>
                  {item.name} ({item.sku})
                </span>
                <span>
                  {item.currentStock} in stock • reorder at {item.reorderLevel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Dashboard

