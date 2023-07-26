import {Router} from 'express';
import {
    getCategories,
    getCategory,
    postCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';

const router = Router();

router.get('/category', getCategories);
router.get('/category/:id', getCategory);
router.post('/category', postCategory);
router.patch('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

export default router;