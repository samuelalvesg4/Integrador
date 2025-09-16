import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Cria o usuário sem a propriedade `role`
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // 2. Com base no role, cria o registro correspondente
        if (role === 'seller') {
            await prisma.seller.create({
                data: {
                    userId: user.id,
                },
            });
        } else if (role === 'customer') {
            await prisma.customer.create({
                data: {
                    userId: user.id,
                },
            });
        } else {
            // Caso um role inválido seja enviado, você pode remover o usuário
            // criado para manter a consistência do banco de dados.
            await prisma.user.delete({ where: { id: user.id } });
            return res.status(400).json({ error: 'Tipo de usuário inválido.' });
        }

        // 3. Autentica e retorna o token
        const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role } });
    } catch (err) {
        if (err.code === 'P2002') { // Erro de email duplicado
            return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }
        console.error("Erro no registro:", err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca o usuário e suas relações (seller e customer) para determinar o role
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                seller: true,   // Inclui a relação com Seller
                customer: true, // Inclui a relação com Customer
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'E-mail ou senha inválidos.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'E-mail ou senha inválidos.' });
        }
        
        // Determina o role com base nas relações incluídas
        let role;
        if (user.seller) {
            role = 'seller';
        } else if (user.customer) {
            role = 'customer';
        } else {
            return res.status(500).json({ error: 'Usuário sem privilégio definido.' });
        }

        // Gera o token com o role correto
        const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

export default router;