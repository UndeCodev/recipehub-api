import {pool} from '../../config/database.js';

export const getCategories = async(req, res) => {
    try{
        const [categories] = await pool.query('SELECT * FROM recipe_categories');

        res.json(categories);     
    }catch(error){
        res.status(500).json({
            message: 'Error al cargar las categorías.'
        });
    }
}

export const getCategory = async(req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM recipe_category WHERE category_id = ?', [req.params.id]);

        if(rows.length <= 0) return res.status(404).json({
            message: 'Category not found'
        });
    
        res.json(rows[0]);        
    }catch(error){
        res.status(500).json({
            message: 'Category not found'
        });
    }
}

export const postCategory = async(req, res) => {
    const {category_name} = req.body;

    try{
        const [rows] = await pool.query('INSERT INTO recipe_category(category_name) VALUES(?)', [category_name]);

        res.json({
            id: rows.insertId,
            category_name
        })
    }catch(error){
        res.status(500).json({
            message: 'Categories not found'
        });
    }
}   

export const updateCategory = async(req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    try{
        const [result] = await pool.query('UPDATE recipe_category SET category_name = IFNULL(?, category_name) WHERE category_id = ?', [category_name, id]);

        if(result.affectedRows === 0) return res.status(404).json({
            message: 'Category not found'
        })
    
        const [rows] = await pool.query('SELECT * FROM recipe_category WHERE category_id = ?', [id]);

        res.json(rows[0]); 
    }catch(error){
        res.status(500).json({
            message: "Category couldn't be updated"
        });
    }
}

export const deleteCategory = async(req, res) => {
    try{
        const [result] = await pool.query('DELETE FROM recipe_category WHERE category_id = ?', [req.params.id]);

        if(result.affectedRows <= 0) return res.status(404).json({
            message: 'Category not found'
        });
    
        res.sendStatus(204); 
    }catch(error){
        res.status(500).json({
            message: "Category couldn't be deleted"
        });
    }
}