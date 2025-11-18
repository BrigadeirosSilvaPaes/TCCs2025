// src/screens/ConfiguracaoScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const ConfiguracaoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Estados locais
  const [notificacoesAtivas, setNotificacoesAtivas] = useState<boolean>(true);
  const [modoEscuro, setModoEscuro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<any>(null);

  // Simular dados do usuário
  const usuarioSimulado = {
    id: 1,
    nome: "Maria Silva",
    email: "maria.silva@email.com"
  };

  // Carregar configs
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar dados simulados
      setUsuario(usuarioSimulado);
      
      // Tentar carregar do AsyncStorage, se não existir usar padrão
      const configsSalvas = await AsyncStorage.getItem('configuracoesUsuario');
      if (configsSalvas) {
        const configs = JSON.parse(configsSalvas);
        setNotificacoesAtivas(configs.notificacoesAtivas);
        setModoEscuro(configs.modoEscuro);
      } else {
        // Valores padrão
        setNotificacoesAtivas(true);
        setModoEscuro(false);
      }
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      Alert.alert("Erro", "Não foi possível carregar as configurações");
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracoes = async (novasConfigs: any) => {
    try {
      await AsyncStorage.setItem('configuracoesUsuario', JSON.stringify(novasConfigs));
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false };
    }
  };

  const sair = () => {
    Alert.alert("Sair", "Tem certeza que quer sair?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        onPress: async () => {
          // Simular logout
          await AsyncStorage.multiRemove(['userData', 'authToken']);
          Alert.alert("Sucesso", "Você saiu da aplicação!");
          // Navegar para login (simulado)
          navigation.getParent()?.navigate('Login');
        }
      },
    ]);
  };

  const alterarSenha = () => {
    Alert.alert(
      "Alterar Senha", 
      "Funcionalidade em desenvolvimento!\n\nEm uma versão completa, aqui você poderia:\n• Inserir senha atual\n• Criar nova senha\n• Confirmar nova senha",
      [{ text: "Entendi", style: "default" }]
    );
  };

  const toggleModoEscuro = async () => {
    const novoModoEscuro = !modoEscuro;
    
    try {
      setSaving(true);
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setModoEscuro(novoModoEscuro);
      
      // Salvar localmente
      await salvarConfiguracoes({
        notificacoesAtivas,
        modoEscuro: novoModoEscuro
      });
      
      Alert.alert("Sucesso", "Modo escuro " + (novoModoEscuro ? "ativado" : "desativado"));
    } catch (error) {
      console.error('Erro ao atualizar modo escuro:', error);
      Alert.alert("Erro", "Falha ao atualizar configurações");
      // Reverter em caso de erro
      setModoEscuro(!novoModoEscuro);
    } finally {
      setSaving(false);
    }
  };

  const toggleNotificacoes = async () => {
    const novasNotificacoes = !notificacoesAtivas;
    
    try {
      setSaving(true);
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotificacoesAtivas(novasNotificacoes);
      
      // Salvar localmente
      await salvarConfiguracoes({
        notificacoesAtivas: novasNotificacoes,
        modoEscuro
      });
      
      Alert.alert("Sucesso", "Notificações " + (novasNotificacoes ? "ativadas" : "desativadas"));
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
      Alert.alert("Erro", "Falha ao atualizar configurações");
      // Reverter em caso de erro
      setNotificacoesAtivas(!novasNotificacoes);
    } finally {
      setSaving(false);
    }
  };

  const simularContatoSuporte = () => {
    Alert.alert(
      "Suporte Técnico",
      "📞 Telefone: (11) 9999-9999\n✉️ Email: suporte@elasapp.com.br\n\nHorário de atendimento:\nSegunda a Sexta: 8h às 18h",
      [{ text: "Fechar", style: "default" }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A4C93" />
          <Text style={styles.loadingText}>Carregando configurações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Moderno */}
        <LinearGradient
          colors={['#6A4C93', '#8B6BAE']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerSubtitle}>Configurações do</Text>
              <Text style={styles.headerTitle}>E.L.A.S</Text>
              <Text style={styles.userInfo}>Olá, {usuario?.nome || 'Usuário'}</Text>
            </View>
            
            <TouchableOpacity onPress={sair} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#F8F6FF', '#FFFFFF']}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/logo_elas.png')}
                  style={styles.heroLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Personalize sua experiência</Text>
                <Text style={styles.heroDescription}>
                  Ajuste as configurações de acordo com suas preferências
                </Text>
                <Text style={styles.demoText}>(Modo Demonstração)</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Seção de Configurações */}
        <View style={styles.configSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="settings" size={28} color="#6A4C93" />
            <Text style={styles.sectionTitle}>Preferências</Text>
          </View>
          
          <View style={styles.configCard}>
            {/* Notificações */}
            <View style={styles.configItem}>
              <View style={styles.configInfo}>
                <View style={[styles.configIcon, { backgroundColor: '#F0F9F0' }]}>
                  <MaterialIcons name="notifications" size={24} color="#4CAF50" />
                </View>
                <View style={styles.configText}>
                  <Text style={styles.configLabel}>Notificações</Text>
                  <Text style={styles.configDescription}>Receber alertas e atualizações</Text>
                  <Text style={styles.statusText}>
                    Status: {notificacoesAtivas ? '✅ Ativo' : '❌ Inativo'}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificacoesAtivas}
                onValueChange={toggleNotificacoes}
                trackColor={{ false: '#E8E2FF', true: '#4CAF50' }}
                thumbColor={notificacoesAtivas ? '#fff' : '#fff'}
                disabled={saving}
              />
              {saving && (
                <ActivityIndicator size="small" color="#6A4C93" style={styles.loadingIndicator} />
              )}
            </View>

            {/* Modo Escuro */}
            <View style={styles.configItem}>
              <View style={styles.configInfo}>
                <View style={[styles.configIcon, { backgroundColor: '#F8F6FF' }]}>
                  <MaterialIcons name="dark-mode" size={24} color="#6A4C93" />
                </View>
                <View style={styles.configText}>
                  <Text style={styles.configLabel}>Modo Escuro</Text>
                  <Text style={styles.configDescription}>Tema escuro para melhor conforto visual</Text>
                  <Text style={styles.statusText}>
                    Status: {modoEscuro ? '🌙 Ativo' : '☀️ Inativo'}
                  </Text>
                </View>
              </View>
              <Switch 
                value={modoEscuro} 
                onValueChange={toggleModoEscuro}
                trackColor={{ false: '#E8E2FF', true: '#6A4C93' }}
                thumbColor={modoEscuro ? '#fff' : '#fff'}
                disabled={saving}
              />
              {saving && (
                <ActivityIndicator size="small" color="#6A4C93" style={styles.loadingIndicator} />
              )}
            </View>
          </View>
        </View>

        {/* Seção de Ações */}
        <View style={styles.actionsSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="security" size={28} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Segurança</Text>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={alterarSenha}
              disabled={saving}
            >
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.actionGradient}
              >
                <MaterialIcons name="lock" size={32} color="#fff" />
                <Text style={styles.actionTitle}>Alterar Senha</Text>
                <Text style={styles.actionDescription}>Atualize sua senha de acesso</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={simularContatoSuporte}
              disabled={saving}
            >
              <LinearGradient
                colors={['#2196F3', '#42A5F5']}
                style={styles.actionGradient}
              >
                <MaterialIcons name="support-agent" size={32} color="#fff" />
                <Text style={styles.actionTitle}>Suporte</Text>
                <Text style={styles.actionDescription}>Fale com nossa equipe</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutLargeButton} 
            onPress={sair}
            disabled={saving}
          >
            <LinearGradient
              colors={['#6A4C93', '#8B6BAE']}
              style={styles.logoutLargeGradient}
            >
              <MaterialIcons name="logout" size={28} color="#fff" />
              <Text style={styles.logoutLargeText}>Sair da Conta</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Termos de Uso */}
        <View style={styles.termsSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="description" size={28} color="#6A4C93" />
            <Text style={styles.sectionTitle}>Termos de Uso</Text>
          </View>
          
          <View style={styles.termsCard}>
            <ScrollView style={styles.termsScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.termsText}>
                <Text style={styles.termsBold}>1. Quem somos{"\n"}</Text>
                O aplicativo <Text style={styles.termsBold}>E.L.A.S</Text> oferece proteção a mulheres com medida protetiva.{"\n\n"}
                
                <Text style={styles.termsBold}>2. Finalidade{"\n"}</Text>
                Garantir resposta rápida com acionamento policial.{"\n\n"}
                
                <Text style={styles.termsBold}>3. Quem pode usar{"\n"}</Text>
                Mulheres com medida protetiva válida.{"\n\n"}
                
                <Text style={styles.termsBold}>4. Dados coletados{"\n"}</Text>
                Nome, CPF, telefone, localização (opcional) e outros dados necessários.{"\n\n"}
                
                <Text style={styles.termsBold}>5. Uso dos dados{"\n"}</Text>
                Exclusivamente para proteção e acionamento das autoridades competentes.{"\n\n"}
                
                <Text style={styles.termsBold}>6. Compartilhamento{"\n"}</Text>
                Somente com autoridades e órgãos públicos, quando necessário.{"\n\n"}
                
                <Text style={styles.termsBold}>7. Segurança{"\n"}</Text>
                Todos os dados são criptografados e armazenados com segurança.{"\n\n"}
                
                Consulte este termo sempre que tiver dúvidas ou queira reforçar sua confiança no nosso compromisso com sua segurança e privacidade.
              </Text>
            </ScrollView>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvido em parceria com:</Text>
          
          <View style={styles.footerLogos}>
            <View style={styles.footerLogoContainer}>
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderLogoText}>🏫</Text>
              </View>
              <Text style={styles.footerLogoText}>Escola Parceira</Text>
            </View>
            
            <View style={styles.footerLogoContainer}>
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderLogoText}>📚</Text>
              </View>
              <Text style={styles.footerLogoText}>Curso Profissional</Text>
            </View>
          </View>
          
          <Text style={styles.copyright}>
            © 2024 E.L.A.S. - Todos os direitos reservados
          </Text>
          <Text style={styles.demoVersion}>Versão de Demonstração - Dados Simulados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles atualizados
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6A4C93',
    fontSize: 16,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8E2FF',
    marginBottom: 5,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  userInfo: {
    fontSize: 12,
    color: '#E8E2FF',
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  heroContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginRight: 20,
  },
  heroLogo: {
    width: 60,
    height: 60,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6A4C93',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: '#666',
  },
  demoText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginTop: 5,
  },
  configSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6A4C93',
    marginLeft: 10,
  },
  configCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  configInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  configIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  configText: {
    flex: 1,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  configDescription: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontWeight: '500',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
  },
  actionGradient: {
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  actionDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
  },
  logoutLargeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutLargeGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLargeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  termsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  termsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: 300,
  },
  termsScroll: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  termsBold: {
    fontWeight: '700',
    color: '#6A4C93',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
  },
  footerText: {
    fontSize: 16,
    color: '#6A4C93',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  footerLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
    marginBottom: 20,
  },
  footerLogoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    minWidth: 120,
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8E2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderLogoText: {
    fontSize: 24,
  },
  footerLogoText: {
    fontSize: 12,
    color: '#6A4C93',
    fontWeight: '600',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#8B6BAE',
    textAlign: 'center',
    marginBottom: 5,
  },
  demoVersion: {
    fontSize: 10,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ConfiguracaoScreen;