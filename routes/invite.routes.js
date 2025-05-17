import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import {
 inviteByEmail
} from '../controller/invite.controller.js';

const router = express.Router();

router.post("/", inviteByEmail)

export default router;
