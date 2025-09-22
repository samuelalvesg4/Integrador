const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'não autenticado' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    // opcional: carregar usuário completo
    req.userFull = await prisma.user.findUnique({ where: { id: payload.id }});
    next();
  } catch (e) {
    return res.status(401).json({ error: 'token inválido' });
  }
}

module.exports = authMiddleware;
