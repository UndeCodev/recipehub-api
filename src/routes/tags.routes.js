import {Router} from 'express';
import {
    getTags,
    getTag,
    postTag,
    updateTag,
    deleteTag
} from '../controllers/tags.controller.js';

const router = Router();

router.get('/tag', getTags);
router.get('/tag/:id', getTag);
router.post('/tag', postTag);
router.patch('/tag/:id', updateTag);
router.delete('/tag/:id', deleteTag);

export default router;