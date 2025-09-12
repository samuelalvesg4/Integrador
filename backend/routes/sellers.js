import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

// --- Middleware de autenticação ---
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SEGREDO_DO_TOKEN");
    req.user = decoded; // contém id, email, role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// --- Retorna produtos do vendedor autenticado ---
router.get("/my-products", authMiddleware, async (req, res) => {
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
router.post("/products", authMiddleware, async (req, res) => {
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
router.get("/sales", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Acesso negado" });

    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(403).json({ message: "Vendedor não encontrado" });

    const sales = await prisma.order.findMany({
      where: { product: { sellerId: seller.id } },
      include: { product: true, client: true },
      orderBy: { createdAt: "desc" },
    });

    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      productName: sale.product.name,
      clientName: sale.client.name,
      quantity: sale.quantity,
      total: sale.total,
      createdAt: sale.createdAt,
    }));

    res.json(formattedSales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar vendas" });
  }
});

export default router;
