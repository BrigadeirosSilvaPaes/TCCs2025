import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  SafeAreaView, 
  Linking,
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

// ======== Navegação ========
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

// ======== Paleta ========
const COLORS = {
  primary: '#6A4C93',
  primaryLight: '#8B6BAE',
  secondary: '#4CAF50',
  white: '#FFFFFF',
  grayDark: '#333333',
  gray: '#666666',
  grayLight: '#999999',
  background: '#F5F6FA',
  backgroundLight: '#F8F6FF',
};

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Bolhas decorativas */}
          <View style={styles.bubble1} />
          <View style={styles.bubble2} />
          <View style={styles.bubble3} />
          
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
              </View>
            </View>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>E.L.A.S</Text>
              <Text style={styles.headerSubtitle}>
                Empoderamento, Liberdade e Apoio Solidário
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* HERO CARD */}
        <View style={styles.mainCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F6FF']}
            style={styles.mainCardGradient}
          >
            <View style={styles.securityBadge}>
              <Ionicons name="lock-closed" size={16} color="#4CAF50" />
              <Text style={styles.securityText}>Sistema Seguro</Text>
            </View>

            <Text style={styles.welcomeTitle}>Seu brilho, nossa prioridade ✨</Text>
            <Text style={styles.welcomeSubtitle}>
              Descubra seu potencial, organize sua rotina e tenha apoio exclusivo 
              para sua segurança e bem-estar. Tudo em um só lugar.
            </Text>
          </LinearGradient>
        </View>

        {/* SEÇÃO DE AÇÃO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="rocket-launch" size={26} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Comece Agora</Text>
          </View>

          <View style={styles.actionsGrid}>
            {/* Botão Entrar */}
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient 
                colors={['#4CAF50', '#66BB6A']} 
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="login" size={34} color={COLORS.white} />
                <Text style={styles.actionTitle}>Entrar</Text>
                <Text style={styles.actionDescription}>Acesse sua conta</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão Cadastrar */}
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('Cadastro')}
            >
              <LinearGradient 
                colors={[COLORS.primary, COLORS.primaryLight]} 
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="person-add" size={34} color={COLORS.white} />
                <Text style={styles.actionTitle}>Cadastrar</Text>
                <Text style={styles.actionDescription}>Comece sua jornada</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Desenvolvido com ❤️ para sua segurança</Text>
          
          <View style={styles.footerLogos}>
            <View style={styles.footerLogoContainer}>
              <View style={styles.footerLogoPlaceholder}>
                <Ionicons name="school" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.footerLogoText}>Escola Parceira</Text>
            </View>
            
            <View style={styles.footerLogoContainer}>
              <View style={styles.footerLogoPlaceholder}>
                <Ionicons name="ribbon" size={24} color={COLORS.primary} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A4C93',
    marginLeft: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionGradient: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
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
    textAlign: 'center',
  },
  demoNote: {
    color: '#FF9800',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Home;