const express = require('express');
const { Alert, User } = require('../models');
const router = express.Router();

// POST /api/alerts
router.post('/', async (req, res) => {
  try {
    const {
      numero_medida,
      latitude,
      longitude,
      usuario_id,
      tipo_alerta = 'sos',
      mensagem = ''
    } = req.body;

    const camposObrigatorios = ['numero_medida', 'latitude', 'longitude', 'usuario_id'];
    const camposFaltando = camposObrigatorios.filter(campo => !req.body[campo]);

    if (camposFaltando.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos obrigatórios não informados: ${camposFaltando.join(', ')}`
      });
    }

    const alert = await Alert.create({
      usuario_id,
      tipo_alerta,
      numero_medida,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      mensagem
    });

    // Carregar dados do usuário
    const alertWithUser = await Alert.findByPk(alert.id, {
      include: [{
        model: User,
        attributes: ['nome', 'nome_social', 'telefone']
      }]
    });

    res.json({
      success: true,
      message: 'Alerta registrado com sucesso',
      data: alertWithUser
    });

  } catch (error) {
    console.error('Erro ao registrar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar alerta: ' + error.message
    });
  }
});

// GET /api/alerts/user/:usuario_id
router.get('/user/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: alerts } = await Alert.findAndCountAll({
      where: { usuario_id },
      include: [{
        model: User,
        attributes: ['nome', 'nome_social', 'telefone']
      }],
      order: [['criado_em', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alertas'
    });
  }
});

// PUT /api/alerts/:id/resolve
router.put('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['nome', 'nome_social', 'telefone']
      }]
    });

    if (alert) {
      alert.status = 'resolvido';
      alert.resolvido_em = new Date();
      await alert.save();

      res.json({
        success: true,
        message: 'Alerta marcado como resolvido',
        data: alert
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Alerta não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao resolver alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;