// backend/routes/order.js

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
// 1. Usar o middleware centralizado e correto que já criamos
import authenticateToken from '../middleware/auth.js'; 

const prisma = new PrismaClient();
const router = Router();

// Rota para criar um novo pedido (finalizar compra)
router.post('/orders', authenticateToken, async (req, res) => {
  // O frontend deve enviar um array de 'items', cada um com 'id' e 'quantity'
  const { items, paymentMethod } = req.body; 
  const userId = req.user.id; // O ID do usuário vem do token verificado pelo middleware

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'O carrinho está vazio.' });
  }

  try {
    // 2. Iniciar uma transação para garantir a integridade dos dados
    const newOrder = await prisma.$transaction(async (tx) => {
      // 2a. Encontrar o 'Customer' correspondente ao 'User' logado
      const customer = await tx.customer.findUnique({
        where: { userId: userId },
      });

      if (!customer) {
        throw new Error('Perfil de cliente não encontrado.');
      }

      // 2b. Calcular o total real buscando os preços no banco de dados
      let totalCents = 0;
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Produto com ID ${item.id} não encontrado.`);
        totalCents += product.priceCents * item.quantity;
      }

      // 2c. Criar o registro principal do Pedido (Order)
      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          totalCents: totalCents,
          status: 'PLACED', // Marcamos o pedido como "Feito"
          paymentMethod: paymentMethod, 
        },
      });

      // 2d. Loop para processar CADA item do carrinho
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        // Validar estoque
        if (!product || product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
        }

        // Criar o registro do Item de Pedido (OrderItem)
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            unitCents: product.priceCents, // Preço do DB!
          },
        });

        // 3. ATUALIZAR O ESTOQUE - O passo que faltava!
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order; // Retorna o pedido criado se tudo deu certo
    });

    res.status(201).json({ message: 'Pedido criado com sucesso!', order: newOrder });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: error.message || 'Erro ao processar o pedido.' });
  }
});

export default router;