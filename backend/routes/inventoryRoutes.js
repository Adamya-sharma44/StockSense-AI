const express = require('express');
const InventoryItem = require('../models/InventoryItem');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all inventory items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// Create new inventory item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(400).json({ message: 'Failed to create item', error: error.message });
  }
});

// Update inventory item
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(400).json({ message: 'Failed to update item', error: error.message });
  }
});

// Delete inventory item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

// Low-stock items
router.get('/low-stock/list', authMiddleware, async (req, res) => {
  try {
    const items = await InventoryItem.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    }).sort({ currentStock: 1 });
    res.json(items);
  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({ message: 'Failed to fetch low-stock items' });
  }
});

module.exports = router;

