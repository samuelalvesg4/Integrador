import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authenticateToken from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Configuração do multer para salvar arquivos na memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota para criar um novo produto (ajustada para não receber arquivos)
router.post('/products', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ error: 'Somente vendedores podem cadastrar produtos' });
        }
        
        const { name, description, price, stock } = req.body;
        if (!name || !description || !price || !stock) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios precisam ser preenchidos.' });
        }

        const seller = await prisma.seller.findUnique({ where: { userId: req.user.id }});
        if (!seller) {
            return res.status(400).json({ error: 'Vendedor não encontrado.' });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                priceCents: price,
                stock: parseInt(stock, 10),
                sellerId: seller.id,
            },
            include: { images: true }
        });

        res.status(201).json(product);
    } catch (err) {
        console.error("Erro ao cadastrar produto:", err);
        res.status(500).json({ error: 'Erro ao cadastrar produto: ' + err.message });
    }
});

// --- NOVA ROTA ADICIONADA AQUI ---
// Rota dedicada para upload de imagens para um produto existente
router.post('/products/:productId/images', authenticateToken, upload.array('images', 6), async (req, res) => {
    try {
        const { productId } = req.params;

        // Converta productId para um inteiro
        const parsedProductId = parseInt(productId);

        // Verifique se o ID é um número válido e se os arquivos existem
        if (isNaN(parsedProductId) || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'ID do produto inválido ou nenhum arquivo de imagem enviado.' });
        }

        const product = await prisma.product.findUnique({
            where: { id: parsedProductId }, // Use o ID validado aqui
            include: { seller: true }
        });

        if (!product || product.seller.userId !== req.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para adicionar imagens a este produto.' });
        }

        const imageUrls = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file.buffer.toString('base64')}`, {
                folder: "uploads"
            });
            imageUrls.push(result.secure_url);
        }

        // Conecta as URLs das imagens ao produto no banco de dados
        await prisma.productImage.createMany({
            data: imageUrls.map(url => ({
                url: url,
                productId: parseInt(productId)
            }))
        });

        res.status(200).json({ imageUrls });
    } catch (err) {
        console.error("Erro ao fazer upload de imagens:", err);
        res.status(500).json({ error: 'Erro ao fazer upload de imagens.' });
    }
});

// Rota para deletar um produto
router.delete('/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { seller: true }
        });
    
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
    
        if (product.seller.userId !== req.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este produto.' });
        }
    
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });
    
        res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (err) {
        console.error("Erro ao deletar produto:", err);
        res.status(500).json({ error: 'Erro ao deletar produto: ' + err.message });
    }
});

// Rota para atualizar um produto
router.put('/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        
        const productToUpdate = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { seller: true }
        });
    
        if (!productToUpdate) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
    
        if (productToUpdate.seller.userId !== req.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este produto.' });
        }
    
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                priceCents: price,
                stock: parseInt(stock, 10),
            },
            include: { images: true }
        });
        
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Erro ao atualizar o produto:", err);
        res.status(500).json({ error: 'Erro ao atualizar o produto: ' + err.message });
    }
});

// Rota para buscar todos os produtos (acessível publicamente)
router.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                images: true
            }
        });

        const productsWithPrice = products.map(product => ({
            ...product,
            price: product.priceCents / 100 
        }));

        res.status(200).json(productsWithPrice);
    } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        res.status(500).json({ error: 'Erro ao buscar os produtos: ' + err.message });
    }
});

export default router;