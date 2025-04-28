// backend/routes/wallet.routes.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getWallet,
  requestWithdrawal,
} from '../controllers/wallet.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getWallet);
router.post('/withdraw', authMiddleware, requestWithdrawal);

export default router;
