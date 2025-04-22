// backend/routes/wallet.routes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getWallet,
  requestWithdrawal,
} from '../controllers/wallet.controller.js';

const router = express.Router();

router.get('/', protect, getWallet);
router.post('/withdraw', protect, requestWithdrawal);

export default router;
