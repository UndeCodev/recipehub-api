import {Router} from 'express';
import { verifyToken, updateProfile } from '../controllers/users.controller.js';

const router = Router();

router.post('/user/verify-token', verifyToken);
router.post('/user/update-profile', updateProfile);

export default router;