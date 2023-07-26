import {pool} from '../../config/database.js';

export const getTags = async(req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM recipe_tags');

        res.json(rows);     
    }catch(error){
        res.status(500).json({
            message: 'Tags not found'
        });
    }
}

export const getTag = async(req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM recipe_tags WHERE tag_id = ?', [req.params.id]);

        if(rows.length <= 0) return res.status(404).json({
            message: 'Tag not found'
        });
    
        res.json(rows[0]);        
    }catch(error){
        res.status(500).json({
            message: 'Tag not found'
        });
    }
}

export const postTag = async(req, res) => {
    const {tag_name} = req.body;

    try{
        const [rows] = await pool.query('INSERT INTO recipe_tags(tag_name) VALUES(?)', [tag_name]);

        res.json({
            id: rows.insertId,
            tag_name
        });
    }catch(error){
       res.status(500).json({
        message: "Couldn't insert the tag"
       }); 
    }
}

export const updateTag = async(req, res) => {
    const { id } = req.params;
    const { tag_name } = req.body;

    try{
        const [result] = await pool.query('UPDATE recipe_tags SET tag_name = IFNULL(?, tag_name) WHERE tag_id = ?', [tag_name, id]);

        if(result.affectedRows === 0) return res.status(404).json({
            message: 'Tag not found'
        });
    
        const [rows] = await pool.query('SELECT * FROM recipe_tags WHERE tag_id = ?', [id]);

        res.json(rows[0]); 
    }catch(error){
        res.status(500).json({
            message: "Tag couldn't be updated"
        });
    }
}

export const deleteTag = async(req, res) => {
    try{
        const [result] = await pool.query('DELETE FROM recipe_tags WHERE tag_id = ?', [req.params.id]);

        if(result.affectedRows === 0) return res.status(404).json({
            message: 'Tag not found'
        });
    
        res.sendStatus(204); 
    }catch(error){
        res.status(500).json({
            message: "Tag couldn't be deleted"
        });
    }
}