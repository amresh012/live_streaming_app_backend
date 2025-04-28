// backend/routes/admin.routes.js
import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import {
  getStreamStats,
  getAllUsers,
  getEarningsReport,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.get('/stream-stats', getStreamStats);
router.get('/users', getAllUsers);
router.get('/earnings', getEarningsReport);

export default router;
