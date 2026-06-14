import express from 'express';
const router = express.Router();
import { protectRoute, authorizeAdmin, authorizeStaff } from '../middleware/auth.js';

import {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getMyComplaints,
  getPublicComplaints,
  getPortfolioStats,
} from '../controllers/complaintController.js';

// ── Public routes (no auth required) ─────────────────────────────────────────
router.get('/stats',  getPortfolioStats);
router.get('/public', getPublicComplaints);

// ── Citizen routes ────────────────────────────────────────────────────────────
router.post('/',   protectRoute, createComplaint);
router.get('/my',  protectRoute, getMyComplaints);

// ── Staff routes (Admin + Officer) — view & update complaints ─────────────────
router.get('/',      protectRoute, authorizeStaff, getAllComplaints);
router.put('/:id',   protectRoute, authorizeStaff, updateComplaintStatus);

export default router;
