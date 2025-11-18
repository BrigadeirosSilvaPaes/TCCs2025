// src/screens/EsqueciSenha.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  SafeAreaView, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  EsqueciSenha: undefined;
  Painel: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const EsqueciSenha: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const irParaLogin = () => navigation.navigate('Login');

  const handleRecuperarSenha = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    try {
      setLoading(true);
      // CORREÇÃO: Usar apiService.auth.esqueciSenha() em vez de apiService.esqueciSenha()
      const response = await apiService.auth.esqueciSenha(email);
      
      if (response.data.success) {
        Alert.alert(
          'Email enviado', 
          response.data.message || `Um link de recuperação foi enviado para: ${email}`,
          [{ text: 'OK', onPress: irParaLogin }]
        );
        setEmail(''); // Limpa o campo após sucesso
      } else {
        Alert.alert('Erro', response.data.message || 'Falha ao enviar email de recuperação');
      }
    } catch (error: any) {
      console.error('Erro na recuperação de senha:', error);
      Alert.alert('Erro', 'Não foi possível processar a solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={['#6A4C93', '#8B6BAE']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.backButton}
                disabled={loading}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerSubtitle}>Recuperação de senha do</Text>
                <Text style={styles.headerTitle}>E.L.A.S</Text>
              </View>
              
              <View style={styles.backButtonPlaceholder} />
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
                  <Text style={styles.heroTitle}>Recupere sua senha</Text>
                  <Text style={styles.heroDescription}>
                    Digite seu email abaixo e enviaremos um link para redefinir sua senha
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Formulário de Recuperação */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="lock-reset" size={28} color="#6A4C93" />
              <Text style={styles.sectionTitle}>Recuperação de Senha</Text>
            </View>
            
            <View style={styles.formCard}>
              {/* Campo de email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="email" size={20} color="#6A4C93" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu email cadastrado"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="send"
                    onSubmitEditing={handleRecuperarSenha}
                  />
                </View>
              </View>

              {/* Botão de envio */}
              <TouchableOpacity 
                style={[styles.enviarButton, loading && styles.buttonDisabled]} 
                onPress={handleRecuperarSenha}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#66BB6A']}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
                      <MaterialIcons name="send" size={20} color="#fff" style={styles.buttonIcon} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Link para voltar ao login */}
              <TouchableOpacity 
                onPress={irParaLogin} 
                style={styles.voltarLink} 
                disabled={loading}
              >
                <MaterialIcons name="arrow-back" size={16} color="#6A4C93" />
                <Text style={styles.voltarText}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <MaterialIcons name="info" size={24} color="#6A4C93" />
              <Text style={styles.infoText}>
                Se não receber o email em alguns minutos, verifique sua pasta de spam.
              </Text>
            </View>
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Desenvolvido em parceria com:</Text>
            
            <View style={styles.footerLogos}>
              <View style={styles.footerLogoContainer}>
                <Image 
                  source={require('../../assets/logo_escola.png')}
                  style={styles.footerLogo} 
                  resizeMode="contain"
                />
                <Text style={styles.footerLogoText}>Escola Parceira</Text>
              </View>
              
              <View style={styles.footerLogoContainer}>
                <Image 
                  source={require('../../assets/logo_curso.png')}
                  style={styles.footerLogo} 
                  resizeMode="contain"
                />
                <Text style={styles.footerLogoText}>Curso Profissional</Text>
              </View>
            </View>
            
            <Text style={styles.copyright}>
              © 2024 E.L.A.S App. Todos os direitos reservados.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles simplificados
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8E2FF',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
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
    marginRight: 15,
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
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A4C93',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#E8E2FF',
    height: 50,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  enviarButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  voltarLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  voltarText: {
    color: '#6A4C93',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
  },
  footerTitle: {
    fontSize: 14,
    color: '#6A4C93',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  footerLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  footerLogoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    minWidth: 120,
  },
  footerLogo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  footerLogoText: {
    fontSize: 12,
    color: '#6A4C93',
    fontWeight: '600',
    textAlign: 'center',
  },
  copyright: {
    color: '#8B6BAE',
    fontSize: 12,
  },
});

export default EsqueciSenha;