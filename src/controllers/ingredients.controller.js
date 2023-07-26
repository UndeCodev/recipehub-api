import {pool} from '../../config/database.js';

export const postIngredient = async(req, res) => {
    try{
        const [rows] = await pool.query('INSERT INTO recipe_ingredients(category_name) VALUES(?)', [category_name]);

        res.json({
            id: rows.insertId,
            category_name
        })
    }catch(error){
        res.status(500).json({
            message: "Couldn't insert the ingredient"
        });
    }
}