const express = require('express');
const { Config } = require('../models');
const router = express.Router();

// GET /api/config/:usuario_id
router.get('/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro usuario_id é obrigatório'
      });
    }

    const config = await Config.findOne({ where: { usuario_id } });

    if (config) {
      res.json({
        success: true,
        data: config
      });
    } else {
      res.json({
        success: true,
        data: {
          notificacoes: true,
          modo_escuro: false,
          compartilhar_localizacao: true,
          idioma: 'pt-BR'
        }
      });
    }

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/config
router.post('/', async (req, res) => {
  try {
    const {
      usuario_id,
      notificacoes,
      modo_escuro,
      compartilhar_localizacao = true,
      idioma = 'pt-BR'
    } = req.body;

    if (!usuario_id || notificacoes === undefined || modo_escuro === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros incompletos'
      });
    }

    const [config, created] = await Config.upsert({
      usuario_id,
      notificacoes: !!notificacoes,
      modo_escuro: !!modo_escuro,
      compartilhar_localizacao: !!compartilhar_localizacao,
      idioma
    });

    res.json({
      success: true,
      message: created ? 'Configurações criadas com sucesso' : 'Configurações atualizadas com sucesso',
      data: config
    });

  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;