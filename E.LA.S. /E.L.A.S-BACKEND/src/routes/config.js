const express = require('express');
const { Config } = require('../models');
const router = express.Router();

// GET /api/config - Buscar configurações do usuário logado
router.get('/', async (req, res) => {
  try {
    const config = await Config.findOne({ 
      where: { usuario_id: req.user.id } 
    });

    if (config) {
      res.json({
        success: true,
        data: config
      });
    } else {
      // Retornar valores padrão
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

// POST /api/config - Salvar configurações do usuário logado
router.post('/', async (req, res) => {
  try {
    const {
      notificacoes,
      modo_escuro,
      compartilhar_localizacao = true,
      idioma = 'pt-BR'
    } = req.body;

    if (notificacoes === undefined || modo_escuro === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros incompletos'
      });
    }

    const [config, created] = await Config.upsert({
      usuario_id: req.user.id,
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