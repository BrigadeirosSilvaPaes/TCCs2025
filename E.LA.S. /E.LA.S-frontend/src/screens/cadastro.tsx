// src/screens/Cadastro.tsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  StyleSheet, ScrollView, Alert, Dimensions,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  EsqueciSenha: undefined;
  Painel: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const Cadastro: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [showSocialNameInput, setShowSocialNameInput] = useState(false);
  const [showCuidadorInput, setShowCuidadorInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const [form, setForm] = useState({
    nome: '', nomeSocial: '', cpf: '', telefone: '',
    cuidador: '', numeroMedida: '', senha: '', confirmarSenha: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  // Animação de shake para erros
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handleChange = (name: string, value: string) => {
    if(name === 'cpf'){
      let val = value.replace(/\D/g,'');
      if(val.length <= 11){
        val = val.replace(/(\d{3})(\d)/,'$1.$2')
                 .replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3')
                 .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4');
        val = val.substring(0,14);
      }
      setForm({...form, [name]: val});
      return;
    }
    if(name === 'telefone'){
      let val = value.replace(/\D/g,'');
      if(val.length <= 11){
        if(val.length === 11){
          val = val.replace(/(\d{2})(\d)/,'($1) $2')
                   .replace(/(\d{5})(\d)/,'$1-$2');
        } else {
          val = val.replace(/(\d{2})(\d)/,'($1) $2')
                   .replace(/(\d{4})(\d)/,'$1-$2');
        }
        val = val.substring(0,15);
      }
      setForm({...form, [name]: val});
      return;
    }
    setForm({...form, [name]: value});
    
    // Limpar erro do campo quando usuário começar a digitar
    if (erros[name]) {
      setErros({...erros, [name]: ''});
    }
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    const {nome, cpf, telefone, numeroMedida, senha, confirmarSenha} = form;
    
    if(!nome.trim()) novosErros.nome = 'Nome completo é obrigatório';
    if(!cpf.trim()) novosErros.cpf = 'CPF é obrigatório';
    else if(cpf.replace(/\D/g,'').length !== 11) novosErros.cpf = 'CPF deve ter 11 dígitos';
    if(!telefone.trim()) novosErros.telefone = 'Telefone é obrigatório';
    else if(telefone.replace(/\D/g,'').length < 10 || telefone.replace(/\D/g,'').length > 11) novosErros.telefone = 'Telefone inválido';
    if(!numeroMedida.trim()) novosErros.numeroMedida = 'Número de medida é obrigatório';
    if(!senha) novosErros.senha = 'Senha é obrigatória';
    else if(senha.length < 6) novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    if(!confirmarSenha) novosErros.confirmarSenha = 'Confirmação de senha é obrigatória';
    else if(senha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';
    
    setErros(novosErros);
    
    // Trigger shake animation se houver erro
    if (Object.keys(novosErros).length > 0) {
      triggerShake();
    }
    
    return Object.keys(novosErros).length === 0;
  };

  const fazerCadastro = async () => {
    if(!validarFormulario()) return;
    
    try {
      setLoading(true);

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Preparar dados para envio
      const dadosCadastro = {
        nome: form.nome.trim(),
        nomeSocial: form.nomeSocial.trim() || null,
        cpf: form.cpf.replace(/\D/g, ''),
        telefone: form.telefone.replace(/\D/g, ''),
        cuidador: form.cuidador.trim() || null,
        numeroMedida: form.numeroMedida.trim(),
        senha: form.senha,
        email: `${form.nome.toLowerCase().replace(/\s+/g, '.')}@email.com` // Email simulado
      };

      // Simular cadastro bem-sucedido
      const usuarioCadastrado = {
        id: Date.now(),
        ...dadosCadastro,
        senha: undefined, // Não salvar a senha
        criado_em: new Date().toISOString(),
        ativo: true
      };

      // Simular salvamento no "banco de dados" (AsyncStorage)
      const usuariosExistentes = await AsyncStorage.getItem('usuariosCadastrados') || '[]';
      const usuarios = JSON.parse(usuariosExistentes);
      
      // Verificar se CPF já existe
      const cpfExistente = usuarios.find((u: any) => u.cpf === dadosCadastro.cpf);
      if (cpfExistente) {
        Alert.alert('❌ CPF já cadastrado', 'Este CPF já está em uso. Tente fazer login.');
        return;
      }

      usuarios.push(usuarioCadastrado);
      await AsyncStorage.setItem('usuariosCadastrados', JSON.stringify(usuarios));

      Alert.alert(
        '✅ Cadastro realizado!', 
        `Bem-vinda, ${form.nome.split(' ')[0]}! Sua conta foi criada com sucesso.\n\nFaça login para acessar o sistema.`,
        [{ text: 'Fazer Login', onPress: () => navigation.navigate('Login') }]
      );

      // Limpar formulário
      setForm({
        nome: '', nomeSocial: '', cpf: '', telefone: '',
        cuidador: '', numeroMedida: '', senha: '', confirmarSenha: ''
      });
      setErros({});
      
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error);
      Alert.alert(
        '⚠️ Erro no Cadastro', 
        'Não foi possível realizar o cadastro. Tente novamente.\n\nEsta é uma demonstração do sistema.',
        [{ text: 'Entendi', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const abrirTermosUso = () => {
    Alert.alert(
      '📋 Termos de Uso e Política de Privacidade',
      `• Seus dados são protegidos e criptografados
• Utilizamos suas informações apenas para sua segurança
• Compartilhamento apenas com autoridades quando necessário
• Você pode solicitar exclusão de dados a qualquer momento
• Nos comprometemos com sua privacidade e segurança

Ao se cadastrar, você concorda com estes termos.`,
      [{ text: 'Entendi e Concordo', style: 'default' }]
    );
  };

  const getInputStyle = (field: string) => {
    const hasError = erros[field];
    return hasError ? styles.inputError : null;
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <LinearGradient
            colors={['#6A4C93', '#8B6BAE', '#9D7CBF']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Bolhas decorativas */}
            <View style={styles.bubble1} />
            <View style={styles.bubble2} />
            <View style={styles.bubble3} />
            
            <View style={styles.headerContent}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.backButton}
                disabled={loading}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerSubtitle}>Crie sua conta no</Text>
                <Text style={styles.headerTitle}>E.L.A.S</Text>
                <Text style={styles.headerTagline}>Proteção e Empoderamento</Text>
              </View>
              
              <View style={styles.backButtonPlaceholder} />
            </View>
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
              {/* Badge de Segurança */}
              <View style={styles.securityBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                <Text style={styles.securityText}>Cadastro Seguro</Text>
              </View>

              <Text style={styles.welcomeTitle}>Junte-se à nossa comunidade</Text>
              <Text style={styles.welcomeSubtitle}>
                Proteção e empoderamento para mulheres. Sua segurança é nossa prioridade.
              </Text>

              {/* Formulário */}
              <View style={styles.formContainer}>
                {/* Nome completo */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Nome completo <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('nome')]}>
                    <Ionicons name="person-outline" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      value={form.nome} 
                      onChangeText={(v) => handleChange('nome', v)} 
                      placeholder="Digite seu nome completo" 
                      editable={!loading}
                      placeholderTextColor="#999"
                      autoCapitalize="words"
                    />
                    {form.nome && !erros.nome && (
                      <Feather name="check-circle" size={16} color="#4CAF50" />
                    )}
                  </View>
                  {erros.nome && (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{erros.nome}</Text>
                    </View>
                  )}
                </View>

                {/* Nome social (opcional) */}
                <TouchableOpacity 
                  onPress={() => setShowSocialNameInput(!showSocialNameInput)} 
                  style={styles.optionalToggle}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showSocialNameInput ? "remove-circle" : "add-circle"} 
                    size={16} 
                    color="#6A4C93" 
                  />
                  <Text style={styles.optionalToggleText}>
                    {showSocialNameInput ? 'Ocultar nome social' : 'Adicionar nome social'}
                  </Text>
                </TouchableOpacity>
                
                {showSocialNameInput && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome social</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#6A4C93" style={styles.inputIcon} />
                      <TextInput 
                        style={styles.input} 
                        value={form.nomeSocial} 
                        onChangeText={(v) => handleChange('nomeSocial', v)} 
                        placeholder="Digite seu nome social (opcional)" 
                        editable={!loading}
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                )}

                {/* CPF */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    CPF <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('cpf')]}>
                    <Ionicons name="card" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      value={form.cpf} 
                      onChangeText={(v) => handleChange('cpf', v)} 
                      placeholder="000.000.000-00" 
                      maxLength={14} 
                      keyboardType="numeric" 
                      editable={!loading}
                      placeholderTextColor="#999"
                    />
                    {form.cpf && !erros.cpf && (
                      <Feather name="check-circle" size={16} color="#4CAF50" />
                    )}
                  </View>
                  {erros.cpf && (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{erros.cpf}</Text>
                    </View>
                  )}
                </View>

                {/* Telefone */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Telefone <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('telefone')]}>
                    <Ionicons name="call" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      value={form.telefone} 
                      onChangeText={(v) => handleChange('telefone', v)} 
                      placeholder="(00) 00000-0000" 
                      keyboardType="phone-pad" 
                      editable={!loading}
                      placeholderTextColor="#999"
                    />
                    {form.telefone && !erros.telefone && (
                      <Feather name="check-circle" size={16} color="#4CAF50" />
                    )}
                  </View>
                  {erros.telefone && (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{erros.telefone}</Text>
                    </View>
                  )}
                </View>

                {/* Cuidador (opcional) */}
                <TouchableOpacity 
                  onPress={() => setShowCuidadorInput(!showCuidadorInput)} 
                  style={styles.optionalToggle}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showCuidadorInput ? "remove-circle" : "add-circle"} 
                    size={16} 
                    color="#6A4C93" 
                  />
                  <Text style={styles.optionalToggleText}>
                    {showCuidadorInput ? 'Ocultar cuidador' : 'Adicionar cuidador'}
                  </Text>
                </TouchableOpacity>
                
                {showCuidadorInput && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cuidador</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="people" size={20} color="#6A4C93" style={styles.inputIcon} />
                      <TextInput 
                        style={styles.input} 
                        value={form.cuidador} 
                        onChangeText={(v) => handleChange('cuidador', v)} 
                        placeholder="Nome do cuidador (opcional)" 
                        editable={!loading}
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                )}

                {/* Número de Medida */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Número de Medida <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('numeroMedida')]}>
                    <Ionicons name="document-text" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      value={form.numeroMedida} 
                      onChangeText={(v) => handleChange('numeroMedida', v)} 
                      placeholder="Digite o número da medida" 
                      editable={!loading}
                      placeholderTextColor="#999"
                      autoCapitalize="characters"
                    />
                    {form.numeroMedida && !erros.numeroMedida && (
                      <Feather name="check-circle" size={16} color="#4CAF50" />
                    )}
                  </View>
                  {erros.numeroMedida && (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{erros.numeroMedida}</Text>
                    </View>
                  )}
                </View>

                {/* Senha */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Senha <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('senha')]}>
                    <Ionicons name="lock-closed" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      value={form.senha} 
                      onChangeText={(v) => handleChange('senha', v)} 
                      placeholder="Crie uma senha (mín. 6 caracteres)" 
                      secureTextEntry={!mostrarSenha} 
                      editable={!loading}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity 
                      onPress={() => setMostrarSenha(!mostrarSenha)} 
                      style={styles.eyeButton} 
                      disabled={loading}
                    >
                      <Feather name={mostrarSenha ? 'eye' : 'eye-off'} size={20} color="#6A4C93"/>
                    </TouchableOpacity>
                  </View>
                  {erros.senha && (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{erros.senha}</Text>
                    </View>
                  )}
                </View>

                {/* Confirmar senha */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Confirmar Senha <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, getInputStyle('confirmarSenha')]}>
                    <Ionicons name="lock-closed" size={20} color="#6A4C93" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      value={form.confirmarSenha} 
                      onChangeText={(v) => handleChange('confirmarSenha', v)} 
                      placeholder="Confirme sua senha" 
                      secureTextEntry={!mostrarConfirmar} 
                      editable={!loading}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity 
                      onPress={() => setMostrarConfirmar(!mostrarConfirmar)} 
                      style={styles.eyeButton} 
                      disabled={loading}
                    >
                      <Feather name={mostrarConfirmar ? 'eye' : 'eye-off'} size={20} color="#6A4C93"/>
                    </TouchableOpacity>
                  </View>
                  {erros.confirmarSenha && (
                    <View style={styles.errorContainer}>
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text style={styles.errorText}>{erros.confirmarSenha}</Text>
                    </View>
                  )}
                </View>

                {/* Botão Cadastrar */}
                <TouchableOpacity 
                  style={[styles.cadastroButton, loading && styles.buttonDisabled]} 
                  onPress={fazerCadastro} 
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
                        <Text style={styles.buttonText}>Criar Minha Conta</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Termos */}
                <TouchableOpacity 
                  onPress={abrirTermosUso} 
                  style={styles.termsContainer}
                  disabled={loading}
                >
                  <Text style={styles.termsText}>
                    Ao se cadastrar, você concorda com nossa{' '}
                    <Text style={styles.termsLink}>Política de Privacidade</Text>
                  </Text>
                </TouchableOpacity>

                {/* Demo Info */}
                <View style={styles.demoContainer}>
                  <Text style={styles.demoTitle}>💡 Modo Demonstração</Text>
                  <Text style={styles.demoText}>
                    • Dados salvos localmente no dispositivo{'\n'}
                    • CPF e telefone com formatação automática{'\n'}
                    • Validação em tempo real{'\n'}
                    • Cadastro simulado para teste
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Desenvolvido com ❤️ para sua segurança</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  backButtonPlaceholder: {
    width: 40,
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
  optionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F8F6FF',
    borderRadius: 12,
    marginBottom: 15,
    gap: 8,
  },
  optionalToggleText: {
    color: '#6A4C93',
    fontSize: 14,
    fontWeight: '600',
  },
  cadastroButton: {
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
  termsContainer: {
    padding: 15,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginBottom: 20,
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
  demoContainer: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
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
  copyright: {
    color: '#8B6BAE',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  demoNote: {
    color: '#FF9800',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Cadastro;