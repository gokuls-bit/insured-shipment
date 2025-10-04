const express = require('express');
const router = express.Router();
const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment
} = require('../controllers/shipmentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getShipments)
  .post(protect, createShipment);

router.route('/:id')
  .get(protect, getShipmentById)
  .put(protect, updateShipment)
  .delete(protect, deleteShipment);

module.exports = router;