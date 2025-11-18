// src/screens/Painel.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Definir os tipos do Drawer
export type DrawerParamList = {
  Painel: undefined;
  Ajuda: undefined;
  Configuracao: undefined;
  Projeto: undefined;
  // Adicione outras telas aqui
};

type PainelScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Painel'>;

const { width, height } = Dimensions.get('window');

const Painel: React.FC = () => {
  const navigation = useNavigation<PainelScreenNavigationProp>();

  const cards = [
    {
      titulo: "Como montar sua nécessaire Perfeita?",
      descricao: "Já passou por uma emergência com a maquiagem ou foi surpreendida por um evento de última hora sem os produtos ideais? Nós do E.L.A.S. vamos te ajudar a montar a nécessaire perfeita para o seu dia a dia!",
      imagem: require('../../assets/necessaire.png'),
      icone: 'makeup',
      cor: '#8A2BE2'
    },
    {
      titulo: "Tipos de Produtos de Maquiagem",
      descricao: "Você sabe a diferença entre os tipos de maquiagem? Vem descobrir os produtos que fazem toda a diferença no resultado final!",
      imagem: require('../../assets/maquiagem.png'),
      icone: 'lips',
      cor: '#6A4C93'
    },
     {
  titulo: "Esponjas de Maquiagem",
  descricao: "Quer um acabamento de milionária sem esforço? A esponja certa faz tua pele ficar lisinha, macia e com aquele glow que nem filtro entrega.",
  imagem: require('../../assets/esponja.png'),
  icone: 'brush',
  cor: '#FF80AB'
},
 {
      titulo: "Como Escolher Tipos de Produtos de Maquiagem",
      descricao: "Você sabe a diferença entre os tipos de pincieis? Vem descobrir os produtos que fazem toda a diferença no resultado final!",
      imagem: require('../../assets/pincel.png'),
      icone: 'palette',
      cor: '#8B6BAE'
    },
  ];

  const sair = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          onPress: () => navigation.getParent()?.navigate('Login' as never)
        }
      ]
    );
  };

  const abrirAjuda = () => {
    navigation.navigate('Ajuda');
  };

  const abrirConfiguracoes = () => {
    navigation.navigate('Configuracao');
  };

  const abrirProjeto = () => {
    navigation.navigate('Projeto');
  };

  const abrirArtigo = (titulo: string) => {
    Alert.alert(
      "Artigo: " + titulo,
      "Em uma versão completa, este artigo seria carregado com todo o conteúdo detalhado sobre o tema.",
      [
        { text: "Fechar", style: "cancel" },
        { text: "Ler Mais", onPress: () => console.log("Abrir artigo completo") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Moderno */}
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
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>Bem-vinda ao</Text>
            <Text style={styles.headerTitle}>E.L.A.S</Text>
            <Text style={styles.headerTagline}>Beleza e Segurança</Text>
          </View>
          
          <TouchableOpacity onPress={sair} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Conteúdo Principal */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F6FF']}
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
                <Text style={styles.heroTitle}>Sua beleza, nossa prioridade</Text>
                <Text style={styles.heroDescription}>
                  Descubra dicas incríveis de maquiagem e cuidados especiais
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Cards de Conteúdo */}
        <View style={styles.cardsSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="star" size={28} color="#6A4C93" />
            <Text style={styles.sectionTitle}>Dicas em Destaque</Text>
          </View>
          
          {cards.map((card, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card}
              onPress={() => abrirArtigo(card.titulo)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8F6FF']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: card.cor + '20' }]}>
                    <MaterialIcons name="article" size={24} color={card.cor} />
                  </View>
                  <Text style={styles.cardTitle}>{card.titulo}</Text>
                </View>
                
                <Text style={styles.cardDescription} numberOfLines={3}>
                  {card.descricao}
                </Text>
                
                <View style={styles.cardImageContainer}>
                  <Image
                    source={card.imagem}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(106, 76, 147, 0.1)']}
                    style={styles.imageOverlay}
                  />
                </View>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.readMoreText}>Ler mais</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#6A4C93" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ações Rápidas */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="flash-on" size={28} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={abrirAjuda}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="help-circle" size={32} color="#fff" />
                <Text style={styles.quickActionText}>Ajuda Emergencial</Text>
                <Text style={styles.quickActionSubtext}>Suporte imediato</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard} onPress={abrirConfiguracoes}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.quickActionGradient}
              >
                <MaterialIcons name="settings" size={32} color="#fff" />
                <Text style={styles.quickActionText}>Configurações</Text>
                <Text style={styles.quickActionSubtext}>Personalize o app</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard} onPress={abrirProjeto}>
              <LinearGradient
                colors={['#6A4C93', '#8B6BAE']}
                style={styles.quickActionGradient}
              >
                <MaterialIcons name="info" size={32} color="#fff" />
                <Text style={styles.quickActionText}>Sobre o Projeto</Text>
                <Text style={styles.quickActionSubtext}>Conheça mais</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['#6A4C93', '#8B6BAE']}
            style={styles.statsCard}
          >
            <Text style={styles.statsTitle}>Juntos pela sua segurança</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>500+</Text>
                <Text style={styles.statLabel}>Dicas compartilhadas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Suporte disponível</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>100%</Text>
                <Text style={styles.statLabel}>Comprometimento</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Rodapé Compacto */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerTitle}>E.L.A.S - Sistema de Proteção Feminina</Text>
          <Text style={styles.copyright}>
            © 2024 - Desenvolvido com ❤️
          </Text>
          <Text style={styles.demoNote}>
            🔬 Modo Demonstração
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
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
  logoutButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  heroContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  heroLogo: {
    width: 60,
    height: 60,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6A4C93',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardsSection: {
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
  card: {
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardImageContainer: {
    height: width * 0.35,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  readMoreText: {
    color: '#6A4C93',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  quickActionGradient: {
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickActionText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  quickActionSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsCard: {
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#E8E2FF',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Footer Compacto
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F8F6FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 5,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 12,
    color: '#6A4C93',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  copyright: {
    color: '#8B6BAE',
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  demoNote: {
    color: '#FF9800',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Painel;