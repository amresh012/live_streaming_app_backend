// backend/routes/subscription.routes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createSubscriptionSession,
  handleWebhook,
} from '../controllers/subscription.controller.js';

const router = express.Router();

// Create Stripe Checkout session
router.post('/create-session/:streamerId', protect, createSubscriptionSession);

// Stripe webhook (no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
