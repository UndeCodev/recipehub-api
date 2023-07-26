import { Router } from 'express';
import fileUpload from 'express-fileupload';

import {
    getRecipes,
    getRecipesCardByUser,
    getRecipe,
    postRecipes,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipes.controller.js';

const router = Router();

router.get('/recipes', getRecipes);
router.get('/recipes-card-by-user/:id', getRecipesCardByUser);
router.get('/recipes/:id', getRecipe);
router.post('/recipes', fileUpload({ useTempFiles: true, tempFileDir: './public/img/recipes'}), postRecipes);
router.patch('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);

export default router;