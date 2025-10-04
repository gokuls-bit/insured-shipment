const express = require('express');
const router = express.Router();
const {
  submitClaim,
  getClaims,
  getClaimById,
  reviewClaim,
  updateClaimStatus
} = require('../controllers/claimController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.route('/')
  .get(protect, getClaims)
  .post(protect, submitClaim);

router.get('/:id', protect, getClaimById);
router.put('/:id/review', protect, authorize('admin', 'moderator'), reviewClaim);
router.put('/:id/status', protect, authorize('admin', 'moderator'), updateClaimStatus);

module.exports = router;