import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/types';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const { width } = Dimensions.get('window');

const Projeto = () => {
  const navigation = useNavigation<NavigationProp>();

  const sair = () => {
    navigation.getParent()?.navigate('Login');
  };

  const cardData = [
    {
      titulo: 'Missão',
      icone: 'flag' as const,
      conteudo:
        'Oferecer uma solução prática e acessível para a proteção de mulheres em situação de vulnerabilidade.',
      cor: '#6A4C93',
    },
    {
      titulo: 'Visão',
      icone: 'visibility' as const,
      conteudo:
        'Tornar-se referência nacional no uso da tecnologia como aliada no enfrentamento da violência doméstica.',
      cor: '#8B6BAE',
    },
    {
      titulo: 'Valores',
      icone: 'favorite' as const,
      conteudo:
        'Compromisso com a vida, empoderamento feminino, ética, inovação e solidariedade.',
      cor: '#4CAF50',
    },
  ];

  const equipe = [
    {
      nome: 'Gabriela De Oliveira Duarte',
      insta: 'https://www.instagram.com/odgabrielaa?igsh=MTY4andpbGdweDY2bQ==',
      cargo: 'Desenvolvedora Back-end',
    },
    {
      nome: 'Gabrieli De Oliveira Porto',
      insta: 'https://www.instagram.com/ggabiporto_?igsh=eTI4NWt0a3MzNG1t',
      cargo: 'Product Manager e Designer UX',
    },
    {
      nome: 'Thais Merladeti Machado',
      insta: 'https://www.instagram.com/thais_merladeti?igsh=Y3Fmb2Z2OWEydWFv',
      cargo: 'Desenvolvedora Front-end',
    },
  ];

  const orientadores = [
    {
      nome: 'José Henrique Silva Lopes',
      insta: 'https://www.instagram.com/professor_henrique?igsh=MXNuc2lpNGd6aGgycQ==', 
      cargo: 'Orientador Geral',
      cor: '#6A4C93',
      icone: 'supervisor-account' as const,
    },
    {
      nome: 'Leonardo Santana Benevides',
      insta: 'https://www.instagram.com/leo_benevides85?igsh=cGFkMnhrdnFzOHkz',
      cargo: 'Coorientador - Parte Técnica',
      cor: '#4CAF50',
      icone: 'code' as const,
    },
    {
      nome: 'Simoni Machado Gomes',
      insta: 'https://www.instagram.com/moninstantmoni?igsh=MWQ4MnU3MXVrdDd5bA==',
      cargo: 'Coorientadora - Língua Portuguesa',
      cor: '#9D7CBF',
      icone: 'menu-book' as const,
    },
  ];

  const abrirInstagram = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Erro ao abrir Instagram:', err)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={['#6A4C93', '#8B6BAE', '#9D7CBF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.bubble1} />
          <View style={styles.bubble2} />
          <View style={styles.bubble3} />

          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.menuButton}
            >
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerSubtitle}>Conheça nossa iniciativa</Text>
              <Text style={styles.headerTitle}>Projeto E.L.A.S.</Text>
              <Text style={styles.headerTagline}>Tecnologia e Proteção</Text>
            </View>

            <TouchableOpacity onPress={sair} style={styles.logoutButton}>
              <Ionicons name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient colors={['#FFFFFF', '#F8F6FF']} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/logo_elas.png')}
                  style={styles.heroLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>
                  Tecnologia a serviço da proteção feminina
                </Text>
                <Text style={styles.heroDescription}>
                  Inovação e segurança para empoderar mulheres através da tecnologia
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Sobre o Projeto */}
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={28} color="#6A4C93" />
              <Text style={styles.sectionTitle}>Sobre o Projeto</Text>
            </View>

            <View style={styles.textCard}>
              <Text style={styles.paragraph}>
                O <Text style={styles.bold}>E.L.A.S.</Text> (Esclarecer, Lutar,
                Apoiar, Salvar) tem como objetivo desenvolver um aplicativo voltado à
                segurança e proteção de mulheres vítimas de violência doméstica.
              </Text>

              <View style={styles.featureGrid}>
                <View style={styles.featureItem}>
                  <LinearGradient
                    colors={['#4CAF50', '#66BB6A']}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons name="location-on" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureText}>Geolocalização</Text>
                </View>

                <View style={styles.featureItem}>
                  <LinearGradient
                    colors={['#6A4C93', '#8B6BAE']}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons name="security" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureText}>Proteção Digital</Text>
                </View>

                <View style={styles.featureItem}>
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E8E']}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons name="access-time" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureText}>Suporte 24h</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Missão, Visão e Valores */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="star" size={28} color="#6A4C93" />
              <Text style={styles.sectionTitle}>Nossos Pilares</Text>
            </View>

            <View style={styles.cardsContainer}>
              {cardData.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cardTouchable}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F8F6FF']}
                    style={[styles.card, { borderLeftColor: card.cor }]}
                  >
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: card.cor + '20' },
                        ]}
                      >
                        <MaterialIcons name={card.icone} size={24} color={card.cor} />
                      </View>
                      <Text style={[styles.cardTitle, { color: card.cor }]}>
                        {card.titulo}
                      </Text>
                    </View>
                    <Text style={styles.cardContent}>{card.conteudo}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Equipe */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="people" size={28} color="#6A4C93" />
              <Text style={styles.sectionTitle}>Nossa Equipe</Text>
            </View>

            <View style={styles.teamContainer}>
              {equipe.map((membro, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.teamMember}
                  onPress={() => abrirInstagram(membro.insta)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#6A4C93', '#8B6BAE']}
                    style={styles.memberIcon}
                  >
                    <MaterialIcons name="person" size={18} color="#fff" />
                  </LinearGradient>
                  <View style={styles.memberInfo}>
                    <Text style={styles.teamMemberName}>{membro.nome}</Text>
                    <Text style={styles.teamMemberRole}>{membro.cargo}</Text>
                  </View>
                  <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Orientação */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="school" size={28} color="#6A4C93" />
              <Text style={styles.sectionTitle}>Orientação</Text>
            </View>

            <View style={styles.advisorContainer}>
              {orientadores.map((orientador, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.advisorItem}
                  onPress={() => abrirInstagram(orientador.insta)}
                  activeOpacity={0.7}
                >
                  <View style={styles.advisorHeader}>
                    <LinearGradient
                      colors={[orientador.cor, orientador.cor + 'CC']}
                      style={styles.advisorIcon}
                    >
                      <MaterialIcons name={orientador.icone} size={16} color="#fff" />
                    </LinearGradient>
                    <View style={styles.advisorInfo}>
                      <Text style={styles.advisorRole}>{orientador.cargo}</Text>
                      <Text style={[styles.advisorName, { color: orientador.cor }]}>
                        {orientador.nome}
                      </Text>
                    </View>
                    <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Desenvolvido em parceria com:</Text>

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
          <Text style={styles.demoNote}>🔬 Modo Demonstração - Dados Simulados</Text>
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
    marginBottom: 20,
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
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
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
  heroContainer: {
    paddingHorizontal: 20,
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
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
  textCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 25,
    color: '#555',
  },
  bold: {
    fontWeight: '800',
    color: '#6A4C93',
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    padding: 15,
    borderRadius: 15,
    flex: 1,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A4C93',
  },
  cardsContainer: {
    marginBottom: 10,
  },
  cardTouchable: {
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    borderLeftWidth: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  teamContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 16,
    color: '#6A4C93',
    fontWeight: '600',
    marginBottom: 4,
  },
  teamMemberRole: {
    fontSize: 12,
    color: '#8B6BAE',
    fontWeight: '500',
  },
  advisorContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  advisorItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  advisorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advisorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  advisorInfo: {
    flex: 1,
  },
  advisorRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  advisorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerTitle: {
    fontSize: 16,
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

export default Projeto;