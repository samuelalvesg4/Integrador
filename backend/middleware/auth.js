// backend/middleware/auth.js

import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET;
if (!secret) {
  // Lança um erro se a chave secreta não estiver definida
  console.error('JWT_SECRET não está definido no arquivo .env');
  process.exit(1); // Encerra o processo da aplicação
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Token de acesso não fornecido.' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      // Retorna 403 (Proibido) se o token for inválido
      return res.status(403).json({ error: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;