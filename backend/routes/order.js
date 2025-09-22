import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/auth.js'; 

const prisma = new PrismaClient();
const router = Router();

// Rota para finalizar compra (original do seu código)
router.post('/checkout', authenticateToken, async (req, res) => {
  const { items, paymentMethod } = req.body; 
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'O carrinho está vazio.' });
  }

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { userId: userId },
      });

      if (!customer) {
        throw new Error('Perfil de cliente não encontrado.');
      }

      let totalCents = 0;
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Produto com ID ${item.id} não encontrado.`);
        totalCents += product.priceCents * item.quantity;
      }

      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          totalCents: totalCents,
          status: 'PLACED',
          paymentMethod: paymentMethod,
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product || product.stock === null || product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
        }

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            unitCents: product.priceCents,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    res.status(201).json({ message: 'Pedido criado com sucesso!', order: newOrder });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: error.message || 'Erro ao processar o pedido.' });
  }
});

// --- NOVAS ROTAS PARA O CLIENTE ---

// Rota para buscar todos os pedidos de um cliente logado
router.get('/orders/my-orders', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'customer' && req.user.role !== 'client') {
            return res.status(403).json({ error: 'Acesso negado. Apenas clientes podem ver seus pedidos.' });
        }

        const customer = await prisma.customer.findUnique({
            where: { userId: req.user.id },
            select: { id: true }
        });

        const orders = await prisma.order.findMany({
            where: { customerId: customer.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: { images: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error("Erro ao buscar pedidos do cliente:", err);
        res.status(500).json({ error: 'Erro ao buscar pedidos do cliente.' });
    }
});

// Rota para o cliente cancelar um pedido
router.put('/orders/:orderId/cancel', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const parsedOrderId = parseInt(orderId);

        if (isNaN(parsedOrderId) || (req.user.role !== 'customer' && req.user.role !== 'client')) {
            return res.status(403).json({ error: 'Acesso negado ou ID de pedido inválido.' });
        }

        const customer = await prisma.customer.findUnique({
            where: { userId: req.user.id },
            select: { id: true }
        });

        const order = await prisma.order.findUnique({
            where: { id: parsedOrderId }
        });

        if (!order || order.customerId !== customer.id) {
            return res.status(403).json({ error: 'Você não tem permissão para cancelar este pedido.' });
        }

        if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
            return res.status(400).json({ error: 'Este pedido não pode ser cancelado.' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parsedOrderId },
            data: { status: 'CANCELLED' }
        });

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("Erro ao cancelar pedido:", err);
        res.status(500).json({ error: 'Erro ao cancelar pedido.' });
    }
});

export default router;