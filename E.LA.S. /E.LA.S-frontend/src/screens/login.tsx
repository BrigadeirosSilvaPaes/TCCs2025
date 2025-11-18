// src/screens/Login.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Dados de usuários simulados
const USUARIOS_SIMULADOS = [
  {
    id: 1,
    nome: "Ana Silva",
    cpf: "123.456.789-00",
    senha: "123456",
    email: "ana.silva@email.com",
    telefone: "(53) 99999-9999",
    medida_protetiva: "2024/001234"
  },
  {
    id: 2,
    nome: "Maria Santos",
    cpf: "987.654.321-00", 
    senha: "123456",
    email: "maria.santos@email.com",
    telefone: "(53) 98888-8888",
    medida_protetiva: "2024/005678"
  }
];

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  MainApp: undefined;
  Painel: undefined;
  Home: undefined;
  Drawer: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Interface para o formulário
interface FormData {
  cpf: string;
  senha: string;
}

// Interface para os erros
interface FormErrors {
  cpf: string;
  senha: string;
}

const Login: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [form, setForm] = useState<FormData>({ cpf: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({ cpf: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animação de shake para erro
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const formatarCPF = (text: string) => {
    const numericText = text.replace(/\D/g, '');
    
    if (numericText.length <= 3) {
      return numericText;
    } else if (numericText.length <= 6) {
      return `${numericText.slice(0, 3)}.${numericText.slice(3)}`;
    } else if (numericText.length <= 9) {
      return `${numericText.slice(0, 3)}.${numericText.slice(3, 6)}.${numericText.slice(6)}`;
    } else {
      return `${numericText.slice(0, 3)}.${numericText.slice(3, 6)}.${numericText.slice(6, 9)}-${numericText.slice(9, 11)}`;
    }
  };

  const validarCPF = (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length === 0) {
      return 'CPF é obrigatório';
    }
    
    if (cpfLimpo.length !== 11) {
      return 'CPF deve ter 11 dígitos';
    }
    
    if (/^(\d)\1+$/.test(cpfLimpo)) {
      return 'CPF inválido';
    }
    
    return '';
  };

  const handleChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatarCPF(value);
    }
    
    setForm(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validarFormulario = () => {
    const novosErros: FormErrors = { 
      cpf: validarCPF(form.cpf), 
      senha: form.senha.length === 0 ? 'Senha é obrigatória' : 
             form.senha.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : '' 
    };

    setErrors(novosErros);
    
    // Trigger shake animation se houver erro
    if (novosErros.cpf || novosErros.senha) {
      triggerShake();
    }
    
    return !novosErros.cpf && !novosErros.senha;
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = (field: keyof FormData) => {
    setFocusedField(null);
    if (field === 'cpf' && form.cpf) {
      const erroCPF = validarCPF(form.cpf);
      setErrors(prev => ({ ...prev, cpf: erroCPF }));
    }
  };

  const fazerLogin = async () => {
    if (!validarFormulario()) return;
    
    try {
      setLoading(true);

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Limpar CPF para comparar apenas números
      const cpfLimpo = form.cpf.replace(/\D/g, '');
      
      // Buscar usuário nos dados simulados
      const usuarioEncontrado = USUARIOS_SIMULADOS.find(
        user => user.cpf.replace(/\D/g, '') === cpfLimpo && user.senha === form.senha
      );

      if (usuarioEncontrado) {
        // Simular token de autenticação
        const authToken = `demo_token_${usuarioEncontrado.id}_${Date.now()}`;
        
        // Salvar dados no AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(usuarioEncontrado));
        await AsyncStorage.setItem('authToken', authToken);
        await AsyncStorage.setItem('lastLogin', new Date().toISOString());
        
        // Feedback visual de sucesso
        Alert.alert(
          '✅ Login realizado com sucesso!',
          `Bem-vinda de volta, ${usuarioEncontrado.nome.split(' ')[0]}!`,
          [{ 
            text: 'Continuar', 
            onPress: () => {
              // CORREÇÃO: Navegar para o Drawer em vez do Painel
              navigation.reset({
  index: 0,
  routes: [{ name: 'MainApp', params: { screen: 'Painel' } }],
});
            }
          }]
        );
      } else {
        triggerShake();
        Alert.alert(
          '❌ Credenciais inválidas',
          'CPF ou senha incorretos. Verifique seus dados e tente novamente.\n\n💡 Dica: Use 123.456.789-00 / 123456',
          [{ text: 'Entendi', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(
        '⚠️ Erro inesperado',
        'Ocorreu um erro durante o login. Tente novamente.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const loginRapido = (usuario: typeof USUARIOS_SIMULADOS[0]) => {
    setForm({
      cpf: usuario.cpf,
      senha: usuario.senha
    });
  };

  const abrirTermoUso = () => {
    Alert.alert(
      '📋 Termos de Uso e Política de Privacidade',
      `• Seus dados são protegidos e criptografados
• Utilizamos localização apenas para sua segurança
• Compartilhamento apenas com autoridades quando necessário
• Você pode excluir sua conta a qualquer momento
• Nos comprometemos com sua privacidade e segurança

Ao fazer login, você concorda com estes termos.`,
      [{ text: 'Entendi e Concordo', style: 'default' }]
    );
  };

  const irParaCadastro = () => {
    Alert.alert(
      '📝 Cadastro',
      'Para criar uma conta real, entre em contato com a administração do sistema.\n\n📞 Contato: (53) 3310-8181',
      [{ text: 'Entendi', style: 'default' }]
    );
  };

  const irParaEsqueciSenha = () => {
    Alert.alert(
      '🔐 Esqueci minha senha',
      'Entre em contato com o suporte para redefinir sua senha:\n\n📞 (53) 3310-8181\n✉️ suporte@elasapp.com.br',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getInputStyle = (field: keyof FormData) => {
    const hasError = errors[field];
    const isFocused = focusedField === field;
    
    if (hasError) {
      return styles.inputError;
    }
    if (isFocused) {
      return styles.inputFocused;
    }
    return null;
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
          {/* Header com Gradiente */}
          <LinearGradient
            colors={['#6A4C93', '#8B6BAE', '#9D7CBF']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="shield-checkmark" size={32} color="#6A4C93" />
                </View>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerSubtitle}>Sua segurança é nossa prioridade</Text>
                <Text style={styles.headerTitle}>E.L.A.S</Text>
                <Text style={styles.headerTagline}>Entre na sua conta protegida</Text>
              </View>
            </View>
            
            {/* Bolhas decorativas */}
            <View style={styles.bubble1} />
            <View style={styles.bubble2} />
            <View style={styles.bubble3} />
          </LinearGradient>

          {/* Card Principal */}
          <Animated.View 
            style={[
              styles.mainCard,
              { transform: [{ translateX: shakeAnimation }] }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8F6FF']}
              style={styles.mainCardGradient}
            >
              {/* Ícone de Segurança */}
              <View style={styles.securityBadge}>
                <Ionicons name="lock-closed" size={24} color="#4CAF50" />
                <Text style={styles.securityText}>Conexão Segura</Text>
              </View>

              <Text style={styles.welcomeTitle}>Bem-vinda de volta</Text>
              <Text style={styles.welcomeSubtitle}>Faça login para acessar seus recursos de proteção</Text>

              {/* Formulário */}
              <View style={styles.formContainer}>
                {/* Campo CPF */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    CPF <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('cpf')]}>
                    <MaterialIcons name="person-outline" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={form.cpf}
                      onChangeText={(text) => handleChange('cpf', text)}
                      onFocus={() => handleFocus('cpf')}
                      onBlur={() => handleBlur('cpf')}
                      placeholder="000.000.000-00"
                      keyboardType="numeric"
                      maxLength={14}
                      editable={!loading}
                      placeholderTextColor="#999"
                    />
                    {form.cpf && !errors.cpf && (
                      <Feather name="check-circle" size={16} color="#4CAF50" />
                    )}
                  </View>
                  {errors.cpf ? (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{errors.cpf}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Campo Senha */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Senha <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('senha')]}>
                    <MaterialIcons name="lock-outline" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={form.senha}
                      onChangeText={(text) => handleChange('senha', text)}
                      onFocus={() => handleFocus('senha')}
                      onBlur={() => handleBlur('senha')}
                      placeholder="Sua senha"
                      secureTextEntry={!mostrarSenha}
                      editable={!loading}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity 
                      onPress={() => setMostrarSenha(!mostrarSenha)} 
                      style={styles.eyeButton}
                      disabled={loading}
                    >
                      <Feather 
                        name={mostrarSenha ? "eye" : "eye-off"} 
                        size={18} 
                        color="#6A4C93" 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.senha ? (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{errors.senha}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Esqueci a Senha */}
                <TouchableOpacity 
                  onPress={irParaEsqueciSenha} 
                  style={styles.forgotPassword}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
                  <Feather name="help-circle" size={14} color="#6A4C93" />
                </TouchableOpacity>

                {/* Botão Entrar */}
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.buttonDisabled]} 
                  onPress={fazerLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#66BB6A']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Entrar na Conta</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Rápido (Demo) */}
                <View style={styles.demoSection}>
                  <Text style={styles.demoTitle}>👆 Login Rápido (Demonstração)</Text>
                  <View style={styles.demoButtons}>
                    {USUARIOS_SIMULADOS.map((usuario, index) => (
                      <TouchableOpacity
                        key={usuario.id}
                        style={styles.demoButton}
                        onPress={() => loginRapido(usuario)}
                        disabled={loading}
                      >
                        <LinearGradient
                          colors={['#8B6BAE', '#9D7CBF']}
                          style={styles.demoGradient}
                        >
                          <Text style={styles.demoButtonText}>
                            Usuário {index + 1}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Divisor */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Botão Cadastrar */}
                <TouchableOpacity 
                  style={[styles.cadastroButton, loading && styles.buttonDisabled]}
                  onPress={irParaCadastro}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#6A4C93', '#8B6BAE']}
                    style={styles.gradientButtonSecondary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="person-add" size={18} color="#fff" />
                    <Text style={styles.buttonTextSecondary}>Criar nova conta</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Termos de Uso */}
                <TouchableOpacity 
                  onPress={abrirTermoUso} 
                  style={styles.termsContainer}
                >
                  <Text style={styles.termsText}>
                    Ao fazer login, você concorda com nossa{' '}
                    <Text style={styles.termsLink}>Política de Privacidade</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Desenvolvido com ❤️ para sua segurança</Text>
            
            <View style={styles.footerLogos}>
              <View style={styles.footerLogoContainer}>
                <View style={styles.footerLogoPlaceholder}>
                  <Ionicons name="school" size={24} color="#6A4C93" />
                </View>
                <Text style={styles.footerLogoText}>Escola Parceira</Text>
              </View>
              
              <View style={styles.footerLogoContainer}>
                <View style={styles.footerLogoPlaceholder}>
                  <Ionicons name="ribbon" size={24} color="#6A4C93" />
                </View>
                <Text style={styles.footerLogoText}>Curso Técnico</Text>
              </View>
            </View>
            
            <Text style={styles.copyright}>
              © 2024 E.L.A.S - Sistema de Proteção Feminina
            </Text>
            <Text style={styles.demoNote}>
              🔬 Modo Demonstração - Dados Simulados
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8E2FF',
    marginBottom: 8,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  headerTagline: {
    fontSize: 14,
    color: '#E8E2FF',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '400',
  },
  bubble1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 20,
    left: 20,
  },
  bubble2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 30,
    right: 40,
  },
  bubble3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 60,
    right: 20,
  },
  mainCard: {
    marginTop: -30,
    marginHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  mainCardGradient: {
    borderRadius: 30,
    padding: 30,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  securityText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6A4C93',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  formContainer: {
    // Form content
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A4C93',
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#E8E2FF',
    height: 56,
  },
  inputFocused: {
    borderColor: '#6A4C93',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6A4C93',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  inputIcon: {
    marginRight: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 5,
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#6A4C93',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  demoSection: {
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  demoButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  demoGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E2FF',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#8B6BAE',
    fontSize: 14,
    fontWeight: '600',
  },
  cadastroButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientButtonSecondary: {
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonTextSecondary: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  termsContainer: {
    padding: 15,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  termsText: {
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
  },
  footerTitle: {
    fontSize: 14,
    color: '#6A4C93',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footerLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 5,
  },
  demoNote: {
    color: '#FF9800',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default Login;