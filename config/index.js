import {config} from 'dotenv';
config();

// PORT RUNNING
export const PORT = process.env.PORT || 3000

// DATABASE
export const DB_DATABASE = process.env.DB_DATABASE || 'test'
export const DB_HOST     = process.env.DB_HOST || 'localhost'
export const DB_PORT     = process.env.DB_PORT || 3306
export const DB_USER     = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || ''

// CLOUDINARY
// export const CLOUD_NAME = process.env.CLOUD_NAME
// export const API_KEY = process.env.API_KEY 
// export const API_SECRET = process.env.API_SECRET 

// IMAGEKIT
// export const PUBLICKEY    = process.env.PUBLICKEY
// export const PRIVATEKEY   = process.env.PRIVATEKEY
// export const URLENDPOINT  = process.env.URLENDPOINT

// JWT
export const SECRET = process.env.SECRET

// Firebase
export const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS