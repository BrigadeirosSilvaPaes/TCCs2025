const express = require('express');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const configRoutes = require('./config');
const alertRoutes = require('./alerts');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
router.use('/profile', authMiddleware, profileRoutes);
router.use('/config', authMiddleware, configRoutes);
router.use('/alerts', authMiddleware, alertRoutes);

// Rota de saúde da API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API ELAS está funcionando!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;