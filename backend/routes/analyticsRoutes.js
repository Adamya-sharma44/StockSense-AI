const express = require('express');
const InventoryItem = require('../models/InventoryItem');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Basic analytics: stock distribution and sales summary
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const items = await InventoryItem.find();

    const totalSkus = items.length;
    const totalStockUnits = items.reduce((sum, i) => sum + (i.currentStock || 0), 0);
    const stockValue = items.reduce(
      (sum, i) => sum + (i.currentStock || 0) * (i.unitPrice || 0),
      0
    );

    const categoryBreakdown = {};
    items.forEach((i) => {
      const key = i.category || 'Uncategorized';
      if (!categoryBreakdown[key]) {
        categoryBreakdown[key] = 0;
      }
      categoryBreakdown[key] += i.currentStock || 0;
    });

    // Simple monthly sales aggregation from salesHistory
    const monthlySalesMap = {};
    items.forEach((item) => {
      (item.salesHistory || []).forEach((sale) => {
        const d = new Date(sale.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlySalesMap[key]) {
          monthlySalesMap[key] = 0;
        }
        monthlySalesMap[key] += sale.quantitySold || 0;
      });
    });

    const monthlySales = Object.entries(monthlySalesMap)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, total]) => ({ month, total }));

    res.json({
      summary: {
        totalSkus,
        totalStockUnits,
        stockValue
      },
      categoryBreakdown,
      monthlySales
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

module.exports = router;

