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
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    if (role === 'seller') {
      await prisma.seller.create({ data: { userId: user.id } });
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "SEGREDO_DO_TOKEN",
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
