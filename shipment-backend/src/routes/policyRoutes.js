const express = require('express');
const router = express.Router();
const {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy
} = require('../controllers/policyController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.route('/')
  .get(protect, getPolicies)
  .post(protect, createPolicy);

router.route('/:id')
  .get(protect, getPolicyById)
  .put(protect, authorize('admin', 'moderator'), updatePolicy);

module.exports = router;