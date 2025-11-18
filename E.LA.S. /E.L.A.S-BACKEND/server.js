const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/database');

// Importar rotas
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const configRoutes = require('./src/routes/config');
const alertRoutes = require('./src/routes/alerts');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/config', configRoutes);
app.use('/api/alerts', alertRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🚀 Backend ELAS MongoDB está rodando!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    version: '1.0.0'
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo ao backend ELAS! 👩💻',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile', 
      config: '/api/config',
      alerts: '/api/alerts'
    }
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎯 Servidor ELAS rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log('📚 Endpoints disponíveis:');
  console.log('   🔐 /api/auth/login');
  console.log('   🔐 /api/auth/register');
  console.log('   👤 /api/profile');
  console.log('   ⚙️  /api/config');
  console.log('   🚨 /api/alerts');
});