import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import sellerRoutes from './routes/sellers.js';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Conecta routers ao app
app.use('/api', authRoutes);      // Todas rotas de auth começam com /api
app.use('/api', sellerRoutes);    // Todas rotas de seller começam com /api

// Inicializa servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
