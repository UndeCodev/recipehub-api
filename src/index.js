import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import recipeRoutes from './routes/recipes.routes.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tags.routes.js';

import { PORT } from '../config/index.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(recipeRoutes);
app.use(categoryRoutes);
app.use(tagRoutes);

// Redirect if it doesn't match any route
app.use((req, res, next) => {
    res.status(404).json({
        message: 'endpoint not fount'
    })
});

app.listen(PORT);
console.log('server running on port', PORT);
