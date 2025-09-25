import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import authenticateToken from '../middleware/auth.js'; 

const prisma = new PrismaClient();
const router = Router();

// --- Retorna produtos do vendedor autenticado ---
router.get("/my-products", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) {
      return res.status(403).json({ message: "Vendedor não encontrado" });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: seller.id },
      include: {
          images: true
      }
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
});

// --- Retorna vendas do vendedor ---
router.get("/sales", authenticateToken, async (req, res) => {
  try {
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
        order: {
          status: {
            in: ['COMPLETED', 'CANCELLED']
          }
        }
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
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
      orderBy: {
        order: {
          createdAt: "desc",
        },
      },
    });

    res.json(itemsVendidos);
  } catch (err) {
    console.error("Erro detalhado ao buscar vendas:", err);
    res.status(500).json({ message: "Erro ao buscar vendas" });
  }
});

export default router;