// src/services/apiService.ts
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================== TIPOS ====================

// Tipos básicos
export interface Usuario {
  id: number;
  nome: string;
  nome_social?: string;
  cpf: string;
  telefone: string;
  email?: string;
  cuidador?: string;
  numero_medida: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface LocalSeguro {
  id: number;
  nome: string;
  descricao: string;
  endereco: string;
  categoria: string;
  telefone: string;
  horario_funcionamento: string;
  latitude: number;
  longitude: number;
  ativo: boolean;
  criado_em: string;
}

export interface Alerta {
  id: number;
  usuario_id: number;
  tipo_alerta: 'emergencia' | 'sos' | 'perigo';
  latitude: number;
  longitude: number;
  mensagem?: string;
  status: 'ativo' | 'cancelado' | 'resolvido';
  criado_em: string;
  resolvido_em?: string;
  usuario?: {
    nome: string;
    nome_social: string;
    telefone: string;
  };
}

export interface Configuracao {
  id: number;
  usuario_id: number;
  notificacoes: boolean;
  modo_escuro: boolean;
  idioma: string;
  compartilhar_localizacao: boolean;
}

// Tipos para requests
export interface LoginRequest {
  usuario: string; // CPF ou numero_medida
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  nomeSocial?: string;
  cpf: string;
  telefone: string;
  email?: string;
  cuidador?: string;
  numeroMedida: string;
  senha: string;
}

export interface AlertaRequest {
  latitude: number;
  longitude: number;
  tipo_alerta?: 'emergencia' | 'sos' | 'perigo';
  mensagem?: string;
}

export interface ConfiguracaoRequest {
  notificacoes: boolean;
  modo_escuro: boolean;
  idioma?: string;
  compartilhar_localizacao?: boolean;
}

export interface PerfilRequest {
  cpf: string;
  nome: string;
  nome_social: string;
  telefone: string;
}

// Tipos para responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: Usuario;
  token?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ==================== CONFIGURAÇÃO ====================

// Configuração para Node.js backend
const getBaseURL = (): string => {
  if (__DEV__) {
    // Para desenvolvimento com Node.js na porta 5000
    if (Platform.OS === 'android') {
      return "http://10.0.2.2:5000/api/"; // Android emulator
    }
    // Para iOS Simulator e outros
    return "http://localhost:5000/api/"; // iOS simulator e desenvolvimento
  }
  return "https://seuservidor.com/api/"; // Produção
};

const API_URL = getBaseURL();

// Criar instância do axios com configurações
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ==================== INTERCEPTORS ====================

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Erro ao buscar token:', error);
    }
    
    console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro no request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Erro na response:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Tratar erros específicos
    if (error.response?.status === 401) {
      // Token expirado - limpar storage
      AsyncStorage.multiRemove(['authToken', 'userData']);
    }
    
    return Promise.reject(error);
  }
);

// ==================== SERVIÇO PRINCIPAL ====================

export const apiService = {
  // 🔐 AUTENTICAÇÃO
  auth: {
    login: (usuario: string, senha: string): Promise<{ data: ApiResponse<{ user: Usuario; token?: string }> }> => 
      api.post('auth/login', { usuario, senha }),

    cadastrar: (dados: CadastroRequest): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
      api.post('auth/register', {
        nome: dados.nome,
        nomeSocial: dados.nomeSocial,
        cpf: dados.cpf,
        telefone: dados.telefone,
        email: dados.email,
        cuidador: dados.cuidador,
        numeroMedida: dados.numeroMedida,
        senha: dados.senha
      }),

    esqueciSenha: (email: string): Promise<{ data: ApiResponse }> => 
      api.post('auth/forgot-password', { email }),

    testarConexao: (): Promise<boolean> => 
      api.get('health', { timeout: 10000 })
        .then(() => true)
        .catch(() => false),
  },

  // 👤 USUÁRIO E PERFIL
  usuario: {
    getPerfil: (): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
      api.get('profile'),
    
    getPerfilPorId: (id: number): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
      api.get(`profile/${id}`),
    
    atualizarPerfil: (dados: PerfilRequest): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
      api.put('profile', dados),

    alterarSenha: (
      senhaAtual: string, 
      novaSenha: string
    ): Promise<{ data: ApiResponse }> =>
      api.post('auth/change-password', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha
      }),
  },

  // ⚙️ CONFIGURAÇÕES
  configuracoes: {
    getConfiguracoes: (): Promise<{ data: ApiResponse<{ data: Configuracao }> }> => 
      api.get('config'),
    
    salvarConfiguracoes: (config: ConfiguracaoRequest): Promise<{ data: ApiResponse<{ data: Configuracao }> }> => 
      api.post('config', config),
  },

  // 🆘 ALERTAS E EMERGÊNCIA
  alertas: {
    // Enviar alerta (com autenticação)
    enviar: (dados: AlertaRequest): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
      api.post('alerts', dados),
    
    // Enviar alerta público (sem autenticação)
    enviarPublico: (dados: {
      usuario_id: number;
      numero_medida: string;
      latitude: number;
      longitude: number;
      tipo_alerta?: 'emergencia' | 'sos' | 'perigo';
      mensagem?: string;
    }): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
      api.post('alerts/public', dados),
    
    // Enviar SOS (com autenticação)
    enviarSOS: (
      latitude: number, 
      longitude: number, 
      mensagem: string = 'Preciso de ajuda!'
    ): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
      api.post('alerts', {
        tipo_alerta: 'sos',
        latitude,
        longitude,
        mensagem
      }),

    // Buscar alertas do usuário logado
    getAlertasUsuario: (limit: number = 50, page: number = 1): Promise<{ data: ApiResponse<{ data: Alerta[]; pagination: any }> }> => 
      api.get(`alerts/user?limit=${limit}&page=${page}`),

    // Buscar alertas por ID de usuário
    getAlertasPorUsuario: (usuarioId: number, limit: number = 50, page: number = 1): Promise<{ data: ApiResponse<{ data: Alerta[]; pagination: any }> }> => 
      api.get(`alerts/user/${usuarioId}?limit=${limit}&page=${page}`),

    // Resolver alerta
    resolverAlerta: (alertaId: number): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
      api.put(`alerts/${alertaId}/resolve`),

    // Resolver alerta público
    resolverAlertaPublico: (alertaId: number): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
      api.put(`alerts/${alertaId}/resolve-public`),

    // Buscar todos os alertas (para admin)
    getAll: (limit: number = 50, page: number = 1, status?: string): Promise<{ data: ApiResponse<{ data: Alerta[]; pagination: any }> }> => {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('page', page.toString());
      if (status) params.append('status', status);
      
      return api.get(`alerts?${params.toString()}`);
    },
  },

  // 🏥 LOCAIS SEGUROS
  locaisSeguros: {
    getAll: (): Promise<{ data: ApiResponse<{ data: LocalSeguro[] }> }> => 
      api.get('locais-seguros'),

    getProximos: (latitude: number, longitude: number, raioKm: number = 10): Promise<{ data: ApiResponse<{ data: LocalSeguro[] }> }> => 
      api.get(`locais-seguros/proximos?latitude=${latitude}&longitude=${longitude}&raio=${raioKm}`),

    getPorCategoria: (categoria: string): Promise<{ data: ApiResponse<{ data: LocalSeguro[] }> }> => 
      api.get(`locais-seguros/categoria/${categoria}`),
  },

  // 🛠️ UTILITÁRIOS
  utils: {
    // Testar conexão com servidor
    testarConexao: (): Promise<{ data: ApiResponse }> => 
      api.get('health', { timeout: 10000 }),

    // Verificar status do servidor
    getStatusServidor: async (): Promise<string> => {
      try {
        await api.get('health', { timeout: 5000 });
        return 'online';
      } catch (error) {
        return 'offline';
      }
    }
  }
};

// ==================== FUNÇÕES DE CONVENIÊNCIA ====================

// Funções de conveniência para uso rápido
export const login = (usuario: string, senha: string): Promise<{ data: ApiResponse<{ user: Usuario; token?: string }> }> => 
  apiService.auth.login(usuario, senha);

export const cadastrar = (dados: CadastroRequest): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
  apiService.auth.cadastrar(dados);

export const esqueciSenha = (email: string): Promise<{ data: ApiResponse }> => 
  apiService.auth.esqueciSenha(email);

export const getPerfil = (): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
  apiService.usuario.getPerfil();

export const atualizarPerfil = (dados: PerfilRequest): Promise<{ data: ApiResponse<{ user: Usuario }> }> => 
  apiService.usuario.atualizarPerfil(dados);

export const getConfiguracoes = (): Promise<{ data: ApiResponse<{ data: Configuracao }> }> => 
  apiService.configuracoes.getConfiguracoes();

export const salvarConfiguracoes = (config: ConfiguracaoRequest): Promise<{ data: ApiResponse<{ data: Configuracao }> }> => 
  apiService.configuracoes.salvarConfiguracoes(config);

export const enviarAlerta = (dados: AlertaRequest): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
  apiService.alertas.enviar(dados);

export const enviarSOS = (
  latitude: number, 
  longitude: number, 
  mensagem?: string
): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
  apiService.alertas.enviarSOS(latitude, longitude, mensagem);

export const getAlertasUsuario = (limit?: number, page?: number): Promise<{ data: ApiResponse<{ data: Alerta[]; pagination: any }> }> => 
  apiService.alertas.getAlertasUsuario(limit, page);

export const resolverAlerta = (alertaId: number): Promise<{ data: ApiResponse<{ data: Alerta }> }> => 
  apiService.alertas.resolverAlerta(alertaId);

export const getLocaisSeguros = (): Promise<{ data: ApiResponse<{ data: LocalSeguro[] }> }> => 
  apiService.locaisSeguros.getAll();

export default apiService;