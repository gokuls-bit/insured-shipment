const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  approveCompany,
  rejectCompany,
  deleteCompany,
  trackClick
} = require('../controllers/companyController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(protect, authorize('admin', 'moderator'), updateCompany)
  .delete(protect, authorize('admin'), deleteCompany);

router.put('/:id/approve', protect, authorize('admin', 'moderator'), approveCompany);
router.put('/:id/reject', protect, authorize('admin', 'moderator'), rejectCompany);
router.post('/:id/click', trackClick);

module.exports = router;