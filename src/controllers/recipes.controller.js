import {pool} from '../../config/database.js';
import { uploadImage } from '../../config/utils/imagekit.js';

export const getRecipes = async(req, res) => {
    try{
        const [recipes] = await pool.query('SELECT * FROM recipes');

        if(recipes.length <= 0) return res.status(404).json({
            message: 'Recipes not found'
        });

        res.json(recipes);     
    }catch(error){
        res.status(500).json({
            message: 'Recipes not found'
        });
    }
}

export const getRecipesCardByUser = async(req, res) => {
    try{
        const [recipes] = await pool.query('SELECT * FROM recipecardview WHERE user_id = ?', [req.params.id]);

        if(recipes.length <= 0) return res.status(404).json({
            message: 'Recetas no encontradas'
        });

        res.json(recipes);     
    }catch(error){
        res.status(500).json({
            message: 'Recetas no encontradas'
        });
    }
}

export const getRecipe = async(req, res) => {
    try{
        const [recipe] = await pool.query('SELECT * FROM recipes WHERE recipe_id = ?', [req.params.id]);

        if(recipe.length <= 0) return res.status(404).json({
            message: 'Tag not found'
        });
    
        res.json(recipe[0]);        
    }catch(error){
        res.status(500).json({
            message: 'Recipe not found'
        });
    }
}

export const postRecipes = async(req, res) => {
    const { 
        user_id, videoURL, description, category_id,
        ingredients, servings, steps, times,
        title, totalTime, yieldRecipe  
    } = req.body;

    try{
        if(!req.files?.coverRecipe){
            return res.status(404).json({
                message: "Imagen de portada de receta obligatoria."
            });
        }
        
        const [recipe_saved] = await pool.query(
            'INSERT INTO recipes(title, description, video_url, servings, yield, total_time, user_id, category_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', 
            [title, description, videoURL, servings, yieldRecipe, totalTime, user_id, category_id]
        );

        if(!recipe_saved) return res.status(409).json({
            message: "La receta no pudo ser guardada, verifica los datos."
        });

        const { insertId: recipeId } = recipe_saved

        if(req.files?.coverRecipe){
            const { coverRecipe } = req.files; 

            const { url, thumbnailUrl } = await uploadImage({
                folder: 'recipes',
                filePath: coverRecipe.tempFilePath,
                fileName: coverRecipe.name
            })
            
            fs.unlink(coverRecipe.tempFilePath)

            const [img_saved] = await pool.query('INSERT INTO images(image_url, thumbnail_url)VALUES(?, ?)', [url, thumbnailUrl]);
            
            const [img_recipe] = await pool.query('INSERT INTO recipe_images_relationship(recipe_id, image_id) VALUES(?, ?)', [recipeId, img_saved.insertId]);

            if(img_saved.affectedRows === 0 || img_recipe.affectedRows === 0) return res.stat(409).json({
                message: "No se puede guardar la imagen de la receta."
            });
        }
        
        const listIngredients = JSON.parse(ingredients),
              listSteps       = JSON.parse(steps),
              listTimes       = JSON.parse(times);
        
        for(const { ingredient } of listIngredients){
            await pool.query(
                'INSERT INTO recipe_ingredients(ingredient_text, recipe_id) VALUES(?, ?)', 
                [ingredient, recipeId]
            )
        }

        for(const { step: stepNumber, text } of listSteps){
            await pool.query(
                'INSERT INTO recipe_steps(step_text, step_number, recipe_id) VALUES(?, ?, ?)', 
                [text, stepNumber, recipeId]
            )
        }

        for(const { type, time } of listTimes){
            await pool.query(
                'INSERT INTO recipe_times(type_time, time, recipe_id) VALUES(?, ?, ?)', 
                [type, time, recipeId]
            )
        }

        return res.sendStatus(200)
    }catch(error){

        console.log(error);
       res.status(500).json({
        message: "No se pudo insertar la receta, intenta de nuevo."
       }); 
    }
}

export const updateRecipe = async(req, res) => {
    const { id } = req.params;
    const { 
        title, description, video_url, cook_time, preparation_time, 
        total_time, rating, created_at, user_id, category_id 
    } = req.body;

    try{
        const [result] = await pool.query(
            'UPDATE recipes SET title = IFNULL(?, title), description = IFNULL(?, description), video_url = IFNULL(?, video_url), cook_time = IFNULL(?, cook_time), preparation_time = IFNULL(?, preparation_time), total_time = IFNULL(?, total_time), rating = IFNULL(?, 1), created_at = IFNULL(?, created_at), user_id = IFNULL(?, user_id), category_id = IFNULL(?, category_id) WHERE recipe_id = ?', 
            [title, description, video_url, cook_time, preparation_time, total_time, rating, created_at, user_id, category_id, id]
        );

        if(result.affectedRows === 0) return res.status(404).json({
            message: 'Recipe not found'
        });
    
        const [rows] = await pool.query('SELECT * FROM recipes WHERE recipe_id = ?', [id]);

        res.json(rows[0]); 
    }catch(error){
        res.status(500).json({
            message: "Recipe couldn't be updated"
        });
    }
}

export const deleteRecipe = async(req, res) => {
    try{
        const [recipe_deleted] = await pool.query('DELETE FROM recipes WHERE recipe_id = ?', [req.params.id]);

        if(recipe_deleted.affectedRows === 0) return res.status(404).json({
            message: 'Recipe not found'
        });
    
        res.sendStatus(204); 
    }catch(error){
        res.status(500).json({
            message: "Recipe couldn't be deleted"
        });
    }
}