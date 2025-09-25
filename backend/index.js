import dotenv from 'dotenv';
dotenv.config();

console.log('--- VARIÁVEL DE AMBIENTE CARREGADA ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('------------------------------------');

import express from 'express';
import cors from 'cors';
import path from 'path'; // Adicione a importação de 'path'
import { fileURLToPath } from 'url'; // Adicione a importação de 'fileURLToPath'
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js'; // Importe as rotas de produto
import sellerRoutes from './routes/sellers.js';
import ordersRoutes from './routes/order.js';
import { v2 as cloudinary } from 'cloudinary';

// Configura o Cloudinary com a URL do seu .env
cloudinary.config({
  secure: true,
  cloudinary_url: process.env.CLOUDINARY_URL
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads'
app.use('/api', productsRoutes); // Conecte a rota de produtos

// Conecta routers ao app
app.use('/api', authRoutes);      // Todas rotas de auth começam com /api
app.use('/api', sellerRoutes);    // Todas rotas de seller começam com /api
app.use('/api', ordersRoutes);

// Inicializa servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
