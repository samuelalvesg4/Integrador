import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/auth.js'; 

const prisma = new PrismaClient();
const router = Router();

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
            where: {
                customerId: customer.id,
                status: {
                    in: ['COMPLETED', 'CANCELLED']
                }
            },
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