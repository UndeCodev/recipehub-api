import {Router} from 'express';
import fileUpload from 'express-fileupload';

import { signUp, signIn } from '../controllers/auth.controller.js';

const router = Router();

router.post('/auth/signin', signIn);
router.post('/auth/signup', fileUpload({ useTempFiles: true, tempFileDir: './public/img/profile_picture'}), signUp);

export default router;