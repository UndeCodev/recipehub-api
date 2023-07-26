import jwt from 'jsonwebtoken';

import {pool} from '../../config/database.js';
import { SECRET } from '../../config/index.js';
import { getAuth } from 'firebase-admin/auth';

import '../../config/utils/firebase.js';

export const verifyToken = async(req, res) => {
    const { providerId } = req.body
    const token = req.headers['x-access-token'];
    
    try{
        if(!token) return res.status(403).json({ message: 'Ningún token proporcionado.' })
        if(!providerId) return res.status(403).json({ message: 'Ningún proveedor proporcionado.' })

        if(providerId === 'firebase'){
            await getAuth().verifyIdToken(token);
        }else{
            const { user } = jwt.verify(token, SECRET)

            const [user_found] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user.email]);
            if(!user_found) return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        return res.sendStatus(200)
    }catch(error){
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

export const updateProfile = async(req, res) => {
    const { user_id, name, last_names, email, about_me } = req.body
    
    try{
        const [resultUpdated] = await pool.query('UPDATE users SET name = IFNULL(?, name), last_names = IFNULL(?, last_names), email = IFNULL(?, email), about_me = IFNULL(?, about_me) WHERE user_id = ?', [name, last_names, email, about_me, user_id]);
        
        if(resultUpdated.affectedRows === 0) return res.statu(404).json({
            message: "No se pudo actualizar el perfil."
        });
        
        const [userUpdated] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

        delete userUpdated[0].password
        delete userUpdated[0].created_at
        delete userUpdated[0].rol_id

        return res.json(userUpdated[0])
    }catch(error){
        return res.status(409).json({
            message: error
        })
    }
}