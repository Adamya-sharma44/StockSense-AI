const express = require('express');
const { OpenAI } = require('openai');
const InventoryItem = require('../models/InventoryItem');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const buildPromptFromInventory = (items) => {
  const summaryLines = items.map((item) => {
    const recentSales =
      item.salesHistory && item.salesHistory.length
        ? item.salesHistory
            .slice(-6)
            .map((s) => `${new Date(s.date).toISOString().split('T')[0]}: ${s.quantitySold}`)
            .join(', ')
        : 'no recent sales data';

    return `Product: ${item.name} (SKU: ${item.sku})
Category: ${item.category}
Current stock: ${item.currentStock}
Reorder level: ${item.reorderLevel}
Reorder quantity: ${item.reorderQuantity}
Recent monthly sales: ${recentSales}`;
  });

  return `You are an AI inventory planning assistant for an e-commerce retail company.
Using the data below, predict short-term demand trends, highlight risks (overstock / stockout),
and provide clear restocking recommendations.

For each product, respond with:
- riskLevel: low/medium/high
- recommendation: short text
- suggestedReorderQuantity: integer
- reasoning: 1-2 sentences

Return a valid JSON array of objects with fields:
sku, riskLevel, recommendation, suggestedReorderQuantity, reasoning.

INVENTORY DATA:
${summaryLines.join('\n\n')}`;
};

router.post('/recommendations', authMiddleware, async (req, res) => {
  try {
    const { season } = req.body; // optional hint: "summer", "winter", etc.
    const items = await InventoryItem.find();

    if (!items.length) {
      return res.status(400).json({ message: 'No inventory data available for recommendations' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const basePrompt = buildPromptFromInventory(items);
    const finalPrompt = season
      ? `${basePrompt}

Additional context: The current season is ${season}. Consider seasonal demand effects where relevant.`
      : basePrompt;

    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: finalPrompt,
      response_format: { type: 'json_object' }
    });

    const rawText = completion.output[0].content[0].text;
    // Expecting something like: { "recommendations": [ ... ] } or just [ ... ]
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error('Failed to parse AI response JSON:', e);
      return res.status(500).json({ message: 'AI response parsing failed' });
    }

    const recommendations = Array.isArray(parsed)
      ? parsed
      : parsed.recommendations || parsed.data || [];

    res.json({ recommendations });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({ message: 'Failed to generate AI recommendations' });
  }
});

module.exports = router;

