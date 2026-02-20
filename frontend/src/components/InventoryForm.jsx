import { useEffect, useState } from 'react'

const emptyItem = {
  name: '',
  sku: '',
  category: '',
  currentStock: 0,
  reorderLevel: 10,
  reorderQuantity: 50,
  unitPrice: 0,
  notes: ''
}

const InventoryForm = ({ onSubmit, loading, initialItem, onCancel }) => {
  const [item, setItem] = useState(emptyItem)

  useEffect(() => {
    if (initialItem) {
      setItem({
        ...initialItem,
        currentStock: initialItem.currentStock ?? 0,
        reorderLevel: initialItem.reorderLevel ?? 0,
        reorderQuantity: initialItem.reorderQuantity ?? 0,
        unitPrice: initialItem.unitPrice ?? 0
      })
    } else {
      setItem(emptyItem)
    }
  }, [initialItem])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (['currentStock', 'reorderLevel', 'reorderQuantity', 'unitPrice'].includes(name)) {
      setItem((prev) => ({ ...prev, [name]: Number(value) }))
    } else {
      setItem((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(item)
  }

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            name="name"
            required
            value={item.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            required
            value={item.sku}
            onChange={handleChange}
            placeholder="e.g. WM-001"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            required
            value={item.category}
            onChange={handleChange}
            placeholder="e.g. Accessories"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="currentStock">Current stock</label>
          <input
            id="currentStock"
            name="currentStock"
            type="number"
            min="0"
            value={item.currentStock}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reorderLevel">Reorder level</label>
          <input
            id="reorderLevel"
            name="reorderLevel"
            type="number"
            min="0"
            value={item.reorderLevel}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reorderQuantity">Reorder quantity</label>
          <input
            id="reorderQuantity"
            name="reorderQuantity"
            type="number"
            min="0"
            value={item.reorderQuantity}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="unitPrice">Unit price</label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            min="0"
            step="0.01"
            value={item.unitPrice}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="2"
          value={item.notes}
          onChange={handleChange}
          placeholder="Any vendor, seasonality, or handling notes..."
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initialItem ? 'Update item' : 'Add item'}
        </button>
      </div>
    </form>
  )
}

export default InventoryForm

