import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Router } from "express";
import authenticateToken from '../middleware/auth.js'

const prisma = new PrismaClient();
const router = Router();

// --- Middleware de autenticação ---

// --- Retorna produtos do vendedor autenticado ---
router.get("/my-products", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Acesso negado" });

    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(403).json({ message: "Vendedor não encontrado" });

    const products = await prisma.product.findMany({
      where: { sellerId: seller.id },
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
});

// --- Cadastra novo produto ---
router.post("/products", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Acesso negado" });

    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(403).json({ message: "Vendedor não encontrado" });

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        sellerId: seller.id,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao cadastrar produto" });
  }
});

// --- Retorna vendas do vendedor ---
router.get("/sales", authenticateToken, async (req, res) => {
  try {
    console.log('--- Verificando Vendas ---');
    console.log('ID do Usuário (do token):', req.user.id);
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.id },
    });

    if (!seller) {
      return res.status(403).json({ message: "Vendedor não encontrado" });
    }

    const itemsVendidos = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: seller.id,
        },
      },
      include: {
        product: true,
        order: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      // CORREÇÃO FINAL: Ordenando pelo createdAt do pedido relacionado
      orderBy: {
        order: {
          createdAt: "desc",
        },
      },
    });

    // Esta parte já estava correta, buscando a data do pedido
    const formattedSales = itemsVendidos.map((item) => ({
      id: item.id,
      productName: item.product.name,
      clientName: item.order.customer.user.name,
      quantity: item.quantity,
      unitCents: item.unitCents,
      createdAt: item.order.createdAt,
      paymentMethod: item.order.paymentMethod, // A data vem do pedido
    }));

    res.json(formattedSales);
  } catch (err) {
    console.error("Erro detalhado ao buscar vendas:", err);
    res.status(500).json({ message: "Erro ao buscar vendas" });
  }
});

export default router;
