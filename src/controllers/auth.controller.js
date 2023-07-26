import fs from 'fs-extra'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {pool} from '../../config/database.js';
import { SECRET } from '../../config/index.js';
import { uploadImage } from '../../config/utils/imagekit.js';

export const signUp = async (req, res) => {
    const { 
        name, last_names, email, password, created_at, rol_name
    } = req.body;

    try {
        const [user_found] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if(user_found.length) return res.status(409).json({ message: `El usuario con el correo ${email} ya existe` });

        if(!req.files?.profile_picture){
            return res.status(404).json({
                message: "Foto de perfil obligatoria."
            });
        }
        
        const encryptedPassword = await encryptPassword(password);
        
        const [rol_found] = await pool.query('SELECT rol_id FROM user_roles WHERE rol_name = IFNULL(?, "Publicador")', [rol_name]);
        const rol_id = rol_found[0].rol_id;

        const [user_created] = await pool.query(
            "INSERT INTO users(name, last_names, email, password, created_at, rol_id) VALUES(?, ?, ?, ?, ?, ?)",
            [name, last_names, email, encryptedPassword, created_at, rol_id]
        );        

        if(req.files?.profile_picture){
            const { profile_picture } = req.files; 

            const { url, thumbnailUrl } = await uploadImage({
                folder: 'profiles',
                filePath: profile_picture.tempFilePath,
                fileName: profile_picture.name
            })
            
            fs.unlink(profile_picture.tempFilePath)

            const [img_saved] = await pool.query('INSERT INTO images(image_url, thumbnail_url)VALUES(?, ?)', [url, thumbnailUrl]);
            
            const [img_profile] = await pool.query('INSERT INTO user_images_relationship(user_id, image_id) VALUES(?, ?)', [user_created.insertId, img_saved.insertId]);

            if(img_saved.affectedRows === 0 || img_profile.affectedRows === 0) return res.stat(404).json({
                message: "No se puede guardar la imagen de perfil"
            });
        }

        const [user] = await pool.query('SELECT * FROM user_public_information WHERE user_id = ?', [user_created.insertId]);

        const token = jwt.sign(
            {user: user[0]},
            SECRET,
            {expiresIn: 86400 } // 24 hours
        )
        
        res.json({token});
    } catch (error) {
        return res.status(409).json({
            message: error
        })
    }
}

export const signIn = async(req, res) => {
    const { email, password } = req.body;
        
    try {
        const [user_found] = await pool.query('SELECT user_id, password FROM users WHERE email = ?', [email]);
        if(!user_found) return res.status(404).json({ message: 'Usuario no encontrado' });

        const match_password = await comparePassword(password, user_found[0].password);
        if(!match_password) return res.status(401).json({ token: null, message: "El correo electrónico o la contraseña no coinciden." });

        const [user] = await pool.query('SELECT * FROM user_public_information WHERE user_id = ?', [user_found[0].user_id]);
    
        const token = jwt.sign(
            { user: user[0] },
            SECRET,
            { expiresIn: 86400 } // 24 hours
        )

        res.json({ token });
    } catch (error) {
        return res.status(404).json({
            message: 'Usuario no encontrado'
        })
    }
}

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, receivedPassword) => await bcrypt.compare(password, receivedPassword); 