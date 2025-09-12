const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../auth');

// config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// listar produtos
router.get('/', async (req, res) => {
  const prods = await prisma.product.findMany({ include: { images: true, seller: { include: { user: true }}}});
  res.json(prods);
});

// criar produto (apenas vendedor)
router.post('/', auth, upload.array('images', 6), async (req, res) => {
  if (!req.user.isSeller) return res.status(403).json({ error: 'somente vendedores' });
  const { title, description, price, quantity } = req.body;
  // encontra seller
  const seller = await prisma.seller.findUnique({ where: { userId: req.user.id }});
  if (!seller) return res.status(400).json({ error: 'vendedor não encontrado' });

  const priceCents = Math.round(parseFloat(price) * 100);

  const product = await prisma.product.create({
    data: {
      title, description, priceCents, quantity: parseInt(quantity,10), sellerId: seller.id
    }
  });

  // salvar imagens
  const imagesData = req.files.map(f => ({ url: `/uploads/${f.filename}`, productId: product.id }));
  await prisma.productImage.createMany({ data: imagesData });

  // gerar php page
  const phpName = await gerarPaginaPHPProduto(product.id);
  await prisma.product.update({ where: { id: product.id }, data: { phpPageName: phpName }});

  const prodFull = await prisma.product.findUnique({ where: { id: product.id }, include: { images: true }});
  res.json(prodFull);
});

module.exports = router;

const pad = (n, width=5) => String(n).padStart(width, '0');
const phpBasePath = path.join(__dirname, '..', 'public', 'php_pages');

async function gerarPaginaPHPProduto(productId) {
  // buscar produto para preencher dados
  const prod = await prisma.product.findUnique({ where: { id: productId }, include: { images: true, seller: { include: { user: true }}}});
  const filename = `produto${pad(productId,5)}.php`; // produto00001.php
  const filepath = path.join(phpBasePath, filename);

  // sanitize strings simples
  const title = escapeHtml(prod.title);
  const desc = escapeHtml(prod.description);
  const price = (prod.priceCents / 100).toFixed(2);

  const imagesHtml = prod.images.map(img => `<img src="${img.url}" style="max-width:300px;" />`).join('\n');

  const phpContent = `<?php
// Página gerada automaticamente — produto id ${prod.id}
?>
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>${title}</title></head>
  <body>
    <h1>${title}</h1>
    <p>Vendedor: ${escapeHtml(prod.seller.user.name)}</p>
    <div>${imagesHtml}</div>
    <p>Preço: R$ ${price}</p>
    <p>Descrição: ${desc}</p>
  </body>
</html>`;

  // assegura pasta existe
  fs.mkdirSync(phpBasePath, { recursive: true });
  fs.writeFileSync(filepath, phpContent, { encoding: 'utf8', flag: 'w' });

  return filename;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
