const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  getExpiringItems
} = require('../controllers/inventoryController');
const { validateInventoryItem } = require('../middleware/validation');

// Get all inventory items with filtering
router.get('/', getInventory);

// Get low stock items
router.get('/low-stock', getLowStockItems);

// Get expiring items
router.get('/expiring', getExpiringItems);

// Get single inventory item
router.get('/:id', getInventoryItem);

// Create new inventory item
router.post('/', validateInventoryItem, createInventoryItem);

// Update inventory item
router.put('/:id', validateInventoryItem, updateInventoryItem);

// Delete inventory item
router.delete('/:id', deleteInventoryItem);

module.exports = router; 