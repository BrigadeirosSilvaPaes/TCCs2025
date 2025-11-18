// CustomDrawer.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function CustomDrawer(props: any) {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6A4C93', '#8B6BAE', '#9D7CBF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Bolhas decorativas */}
        <View style={styles.bubble1} />
        <View style={styles.bubble2} />
        
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={32} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>E.L.A.S</Text>
            <Text style={styles.headerSubtitle}>Sistema de Proteção</Text>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={40} color="#fff" />
          <Text style={styles.userName}>Usuária</Text>
          <Text style={styles.userStatus}>Online</Text>
        </View>
      </LinearGradient>

      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menu}>
          <DrawerItem
            label="Painel Principal"
            onPress={() => props.navigation.navigate('Painel')}
            icon={({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />}
            labelStyle={styles.label}
          />
          <DrawerItem
            label="Ajuda Emergencial"
            onPress={() => props.navigation.navigate('Ajuda')}
            icon={({ color, size }) => <Ionicons name="help-buoy" size={size} color={color} />}
            labelStyle={styles.label}
          />
          <DrawerItem
            label="Configurações"
            onPress={() => props.navigation.navigate('Configuracao')}
            icon={({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />}
            labelStyle={styles.label}
          />
          <DrawerItem
            label="Sobre o Projeto"
            onPress={() => props.navigation.navigate('Projeto')}
            icon={({ color, size }) => <MaterialIcons name="lightbulb" size={size} color={color} />}
            labelStyle={styles.label}
          />
        </View>

        {/* Seção de Recursos */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Recursos</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureItem}>
              <Ionicons name="location" size={20} color="#6A4C93" />
              <Text style={styles.featureText}>Localização</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureItem}>
              <Ionicons name="notifications" size={20} color="#6A4C93" />
              <Text style={styles.featureText}>Alertas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color="#6A4C93" />
              <Text style={styles.featureText}>Segurança</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureItem}>
              <Ionicons name="people" size={20} color="#6A4C93" />
              <Text style={styles.featureText}>Rede</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Footer com Botão de Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.version}>Versão 1.0.0</Text>
        <Text style={styles.demoNote}>🔬 Modo Demonstração</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 25,
    paddingTop: 60,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  userStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  bubble1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 20,
    right: 30,
  },
  bubble2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 20,
    left: 20,
  },
  scrollContent: {
    paddingTop: 10,
  },
  menu: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featuresSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6A4C93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    minWidth: '45%',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#6A4C93',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#F8F6FF',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#8B6BAE',
    fontSize: 12,
    marginBottom: 5,
  },
  demoNote: {
    textAlign: 'center',
    color: '#FF9800',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default CustomDrawer;