import { Router } from 'express';
import fileUpload from 'express-fileupload';

import {
    getRecipesCards,
    getRecipesCardByUser,
    getRecipe,
    postRecipes,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipes.controller.js';

const router = Router();

router.get('/recipes-cards', getRecipesCards);
router.get('/recipes-card-by-user/:id', getRecipesCardByUser);
router.get('/recipes/:recipeId', getRecipe);
router.post('/recipes', fileUpload({ useTempFiles: true, tempFileDir: './public/img/recipes'}), postRecipes);
router.patch('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);

export default router;