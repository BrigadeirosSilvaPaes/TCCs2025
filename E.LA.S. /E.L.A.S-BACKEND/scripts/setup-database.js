const mongoose = require('mongoose');
require('dotenv').config();

// CONEXÃO SIMPLES - sem importar modelos ainda
async function setupDatabase() {
  try {
    console.log('🚀 Iniciando setup do banco ELAS...');
    
    // Conectar
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elas';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Criar modelos diretamente aqui (para evitar imports)
    const User = mongoose.model('User', new mongoose.Schema({
      nome: { type: String, required: true },
      nome_social: String,
      cpf: { type: String, required: true, unique: true },
      telefone: { type: String, required: true, unique: true },
      email: String,
      cuidador: String,
      numero_medida: { type: String, required: true, unique: true },
      senha: { type: String, required: true },
      ativo: { type: Boolean, default: true }
    }, { timestamps: true }));

    const Alert = mongoose.model('Alert', new mongoose.Schema({
      usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      tipo_alerta: { type: String, enum: ['emergencia', 'sos', 'perigo'], default: 'sos' },
      numero_medida: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      mensagem: String,
      status: { type: String, enum: ['ativo', 'cancelado', 'resolvido'], default: 'ativo' },
      resolvido_em: Date
    }, { timestamps: { createdAt: 'criado_em' } }));

    const Config = mongoose.model('Config', new mongoose.Schema({
      usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
      notificacoes: { type: Boolean, default: true },
      modo_escuro: { type: Boolean, default: false },
      idioma: { type: String, default: 'pt-BR' },
      compartilhar_localizacao: { type: Boolean, default: true }
    }));

    // Criar índices
    await User.createIndexes();
    await Alert.createIndexes();
    await Config.createIndexes();
    
    console.log('✅ Índices criados');

    // Criar uma coleção inserindo um documento vazio e removendo
    await User.create({ 
      nome: "Usuario Teste", 
      cpf: "00000000000", 
      telefone: "00000000000", 
      numero_medida: "TEST001",
      senha: "temp"
    });
    await User.deleteOne({ cpf: "00000000000" });

    console.log('🎉 Banco "elas" criado com sucesso!');
    
    // Mostrar status
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Coleções no banco:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada');
    
  } catch (error) {
    console.error('❌ Erro no setup:', error);
    process.exit(1);
  }
}

setupDatabase();