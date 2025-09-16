import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

// Middleware para autenticação
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Token ausente" });

  try {
    const token = auth.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// Criar pedido
router.post("/orders", authMiddleware, async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ error: "Carrinho vazio" });

  try {
    // pegar o vendedor do primeiro produto (simples por enquanto)
    const product = await prisma.product.findUnique({
      where: { id: items[0].id },
    });
    if (!product) return res.status(400).json({ error: "Produto inválido" });

    const order = await prisma.order.create({
      data: {
        customerId: req.user.userId,
        sellerId: product.sellerId,
        totalCents: items.reduce(
          (sum, item) => sum + item.priceCents * item.quantity,
          0
        ),
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            unitCents: item.priceCents,
          })),
        },
      },
      include: { items: true },
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

export default router;
