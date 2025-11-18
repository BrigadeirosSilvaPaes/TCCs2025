// src/screens/Ajuda.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  RefreshControl,
  PermissionsAndroid,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
interface Usuario {
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

interface LocalizacaoUsuario {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface LocalSeguro {
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

interface LocalSeguroComDistancia extends LocalSeguro {
  distancia?: number;
}

const { width, height } = Dimensions.get('window');

const Ajuda: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  
  const [locais, setLocais] = useState<LocalSeguroComDistancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);
  const [localizacao, setLocalizacao] = useState<LocalizacaoUsuario | null>(null);
  const [permissaoLocalizacao, setPermissaoLocalizacao] = useState(false);
  const [pulseAnimation] = useState(new Animated.Value(1));

  // Simular dados do usuário
  const usuarioSimulado: Usuario = {
    id: 1,
    nome: "Ana Silva",
    nome_social: "Ana",
    cpf: "123.456.789-00",
    telefone: "(53) 99999-9999",
    email: "ana.silva@email.com",
    cuidador: "Maria Santos",
    numero_medida: "2024/001234",
    ativo: true,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  };

  // Animação de pulsação para o botão de emergência
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarUsuario = async () => {
    try {
      // Simular carregamento do usuário
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsuario(usuarioSimulado);
      return usuarioSimulado;
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      return null;
    }
  };

  const solicitarPermissaoLocalizacao = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de Localização',
            message: 'Este app precisa acessar sua localização para mostrar locais de ajuda próximos.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Erro ao solicitar permissão:', err);
        return false;
      }
    }
    return true;
  };

  const obterLocalizacaoUsuario = (): Promise<LocalizacaoUsuario> => {
    return new Promise((resolve, reject) => {
      // Simular obtenção de localização
      setTimeout(() => {
        // Localização simulada de Pelotas/RS
        const loc = {
          latitude: -31.763889 + (Math.random() - 0.5) * 0.01,
          longitude: -52.341667 + (Math.random() - 0.5) * 0.01,
          accuracy: 50
        };
        setLocalizacao(loc);
        resolve(loc);
      }, 1000);
    });
  };

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c;
    return Math.round(distancia * 100) / 100;
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const permissaoConcedida = await solicitarPermissaoLocalizacao();
      setPermissaoLocalizacao(permissaoConcedida);

      if (permissaoConcedida) {
        await obterLocalizacaoUsuario();
      }

      await carregarUsuario();
      await carregarLocaisProximos();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarErro('Não foi possível carregar os dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

 const carregarLocaisProximos = async () => {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    const locaisMockados: LocalSeguroComDistancia[] = [
      {
        id: 1,
        nome: "Delegacia Especializada no Atendimento à Mulher (DEAM) - Rio Grande",
        descricao: "Delegacia especializada no atendimento à mulher para registro de ocorrências de violência doméstica, medidas protetivas e investigação.",
        endereco: "Rua Marechal Andréa, 44 - Centro, Rio Grande - RS, 96201-250",
        categoria: "delegacia",
        telefone: "(53) 3236-2016",
        horario_funcionamento: "Segunda a sexta-feira: 08:30 às 12:00 e 13:30 às 18:00",
        latitude: -32.035378,
        longitude: -52.107580,
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: 2,
        nome: "Juizado de Violência Doméstica e Familiar - Rio Grande",
        descricao: "Órgão do poder judiciário especializado no julgamento de casos de violência doméstica e familiar contra a mulher.",
        endereco: "Rua Apody dos Reis, 16 - Centro Cívico, Rio Grande - RS, 96214-264",
        categoria: "centro_apoio",
        telefone: "(53) 3036-8300",
        horario_funcionamento: "Segunda a sexta-feira: 12:00 às 19:00",
        latitude: -32.032249,
        longitude: -52.094784,
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: 3,
        nome: "Centro de Referência Especializado de Assistência Social (CREAS) - Rio Grande",
        descricao: "Serviço de proteção social especial para famílias e indivíduos em situação de risco pessoal e social, incluindo violência doméstica.",
        endereco: "Avenida Major Carlos Pinto, 117 - Cidade Nova, Rio Grande - RS, 96211-021",
        categoria: "centro_apoio",
        telefone: "(53) 3231-1940",
        horario_funcionamento: "Segunda a sexta-feira: 09:00 às 17:00",
        latitude: -32.033579,
        longitude: -52.107069,
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: 4,
        nome: "Centro de Referência de Atendimento à Mulher (CRAM) - Rio Grande",
        descricao: "Serviço especializado no atendimento à mulher em situação de violência, oferecendo acolhimento, orientação e encaminhamentos.",
        endereco: "Avenida Silva Paes, 191 - 5° andar - Centro, Rio Grande - RS, 96200-340",
        categoria: "centro_apoio",
        telefone: "(53) 3237-4242",
        horario_funcionamento: "Segunda a sexta-feira: 08:00 às 17:00",
        latitude: -32.033760,
        longitude: -52.092980,
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: 5,
        nome: "Patrulha Maria da Penha - Rio Grande",
        descricao: "Serviço policial especializado na fiscalização do cumprimento de medidas protetivas de urgência concedidas às mulheres em situação de violência.",
        endereco: "Avenida Honório Bicalho, 20 - Getúlio Vargas, Rio Grande - RS, 96201-020",
        categoria: "delegacia",
        telefone: "(53) 3231-3533",
        horario_funcionamento: "Plantão 24 horas para emergências",
        latitude: -32.039352,
        longitude: -52.077641,
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: 6,
        nome: "Serviço Acolher - Hospital Universitário Dr. Miguel Riet Corrêa Jr.",
        descricao: "Serviço de acolhimento e atendimento integral à mulher em situação de violência no ambiente hospitalar, com equipe multidisciplinar.",
        endereco: "Rua Visconde de Paranaguá, 102 - Centro, Rio Grande - RS, 96200-190",
        categoria: "hospital",
        telefone: "(53) 3233-8800",
        horario_funcionamento: "Atendimento 24 horas",
        latitude: -32.034444,
        longitude: -52.097222,
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: 7,
        nome: "Farmácia Popular - Rio Grande",
        descricao: "Farmácia com atendimento estendido.",
        endereco: "Rua General Bacelar, 789 - Centro, Rio Grande - RS",
        categoria: "farmacia",
        telefone: "(53) 3232-4455",
        horario_funcionamento: "Segunda a sábado: 08:00 às 22:00",
        latitude: -32.033333,
        longitude: -52.096667,
        ativo: true,
        criado_em: new Date().toISOString()
      }
    ];

    if (localizacao) {
      const locaisComDistancia = locaisMockados.map(local => ({
        ...local,
        distancia: calcularDistancia(
          localizacao.latitude,
          localizacao.longitude,
          local.latitude,
          local.longitude
        )
      }));

      locaisComDistancia.sort((a, b) => (a.distancia || 999) - (b.distancia || 999));
      setLocais(locaisComDistancia);
    } else {
      setLocais(locaisMockados);
    }
  } catch (error) {
    console.error('Erro ao carregar locais próximos:', error);
    mostrarErro('Não foi possível carregar os locais de ajuda.');
  }
};

const mostrarErro = (mensagem: string) => {
  Alert.alert('❌ Erro', mensagem);
};
  const acionarAlerta = async () => {
    Alert.alert(
      "🚨 ALERTA DE EMERGÊNCIA",
      "Você está prestes a acionar o sistema de emergência. Esta ação notificará as autoridades e sua rede de apoio.\n\n⚠️ MODO DEMONSTRAÇÃO ⚠️",
      [
        { 
          text: "Cancelar", 
          style: "cancel",
          onPress: () => console.log('Alerta cancelado pelo usuário')
        },
        { 
          text: "SIM, PRECISO DE AJUDA", 
          style: "destructive",
          onPress: enviarAlertaEmergencia
        }
      ]
    );
  };

  const enviarAlertaEmergencia = async () => {
    try {
      setEnviandoAlerta(true);
      
      let localizacaoAlerta = localizacao;
      
      if (!localizacaoAlerta) {
        try {
          localizacaoAlerta = await obterLocalizacaoUsuario();
        } catch (error) {
          console.error('Erro ao obter localização para alerta:', error);
          localizacaoAlerta = {
            latitude: -31.773333,
            longitude: -52.342889
          };
        }
      }

      // Simular envio do alerta com progresso
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular resposta bem-sucedida
      Alert.alert(
        "✅ ALERTA ENVIADO COM SUCESSO!",
        `Sua solicitação de ajuda foi registrada e as autoridades foram notificadas.\n\n📍 Sua localização foi compartilhada\n👮‍♀️ Polícia acionada\n🏥 Serviços de emergência alertados\n📞 Sua rede de apoio notificada\n\nMantenha a calma e aguarde instruções.`,
        [{ text: "ENTENDI", style: "default" }]
      );

      // Simular histórico de alertas
      const alertaSimulado = {
        id: Date.now(),
        usuario: usuario?.nome,
        localizacao: localizacaoAlerta,
        timestamp: new Date().toISOString(),
        status: 'enviado'
      };

      // Salvar no AsyncStorage para histórico
      const alertasAnteriores = await AsyncStorage.getItem('alertasSimulados') || '[]';
      const alertas = JSON.parse(alertasAnteriores);
      alertas.push(alertaSimulado);
      await AsyncStorage.setItem('alertasSimulados', JSON.stringify(alertas));

    } catch (error: any) {
      console.error('Erro ao enviar alerta:', error);
      Alert.alert(
        "❌ ERRO NO ENVIO",
        "Não foi possível enviar o alerta neste momento. Tente novamente ou ligue para 190.\n\nEsta é uma demonstração do sistema.",
        [{ text: "ENTENDI", style: "default" }]
      );
    } finally {
      setEnviandoAlerta(false);
    }
  };

  const ligarParaLocal = (telefone: string, nome: string) => {
    Alert.alert(
      `📞 Ligar para ${nome}`,
      `Você será redirecionado para o discador para ligar para:\n\n${telefone}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Ligar", onPress: () => Linking.openURL(`tel:${telefone}`) }
      ]
    );
  };

  const abrirMaps = (endereco: string, lat?: number, lng?: number, nome?: string) => {
    const url = lat && lng 
      ? `https://maps.google.com/?q=${lat},${lng}`
      : `https://maps.google.com/?q=${encodeURIComponent(endereco)}`;
    
    Alert.alert(
      "🗺️ Abrir no Maps",
      `Abrir localização de ${nome} no aplicativo de mapas?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir Maps", onPress: () => Linking.openURL(url) }
      ]
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const abrirDrawer = () => {
    navigation.openDrawer();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarLocaisProximos();
    if (permissaoLocalizacao) {
      await obterLocalizacaoUsuario();
    }
    setRefreshing(false);
  }, [localizacao, permissaoLocalizacao]);

  const getMarkerIcon = (categoria: string): string => {
    const icons: { [key: string]: string } = {
      'delegacia': 'shield-checkmark',
      'hospital': 'medkit-outline',
      'upa': 'medical-outline',
      'farmacia': 'medical-outline',
      'centro_apoio': 'people-outline',
      'juridico': 'business-outline',
      'outros': 'location-outline'
    };
    return icons[categoria] || 'location-outline';
  };

  const getMarkerColor = (categoria: string): string => {
    const colors: { [key: string]: string } = {
      'delegacia': '#4A90E2',
      'hospital': '#FF6B6B',
      'upa': '#FFA500',
      'farmacia': '#50C878',
      'centro_apoio': '#8A2BE2',
      'juridico': '#9C27B0'
    };
    return colors[categoria] || '#8A2BE2';
  };

  const formatarDistancia = (distancia?: number): string => {
    if (!distancia) return 'Calculando...';
    
    if (distancia < 1) {
      return `${Math.round(distancia * 1000)} m`;
    } else {
      return `${distancia.toFixed(1)} km`;
    }
  };

  const renderHeader = () => (
    <LinearGradient 
      colors={['#8A2BE2', '#9370DB', '#9D7CBF']} 
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={abrirDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerUser}>
          <Ionicons name="person-circle" size={20} color="#fff" />
          <Text style={styles.headerUserName}>
            {usuario?.nome?.split(' ')[0] || 'Usuário'}
          </Text>
        </View>
      </View>

      <View style={styles.headerContent}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={36} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerText}>REDE DE PROTEÇÃO</Text>
          <Text style={styles.headerSubtext}>
            {permissaoLocalizacao ? 'Locais de ajuda próximos a você' : 'Serviços especializados de apoio'}
          </Text>
        </View>
      </View>

      {localizacao && (
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={12} color="#fff" />
          <Text style={styles.localizacaoText}>
            Localização: {localizacao.latitude.toFixed(4)}, {localizacao.longitude.toFixed(4)}
          </Text>
        </View>
      )}
      
      <View style={styles.demoBadge}>
        <Ionicons name="flask" size={12} color="#fff" />
        <Text style={styles.demoBadgeText}>MODO DEMONSTRAÇÃO</Text>
      </View>
    </LinearGradient>
  );

  const renderEmergencyButton = () => (
    <View style={styles.emergencyContainer}>
      <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
        <TouchableOpacity 
          style={[styles.emergencyButton, enviandoAlerta && styles.buttonDisabled]} 
          onPress={acionarAlerta}
          disabled={enviandoAlerta}
        >
          <LinearGradient 
            colors={['#FF4757', '#FF6B6B', '#FF8E8E']} 
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {enviandoAlerta ? (
              <View style={styles.emergencyLoading}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.emergencyLoadingText}>Enviando alerta...</Text>
              </View>
            ) : (
              <>
                <View style={styles.emergencyIcon}>
                  <Ionicons name="alert-circle" size={32} color="#fff" />
                </View>
                <Text style={styles.emergencyText}>PEDIDO DE AJUDA</Text>
                <Text style={styles.emergencySubtext}>Toque para acionar emergência</Text>
                <View style={styles.emergencyDemo}>
                  <Ionicons name="flask" size={10} color="#fff" />
                  <Text style={styles.emergencyDemoText}>MODO SIMULAÇÃO</Text>
                </View>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderLocalItem = (local: LocalSeguroComDistancia) => (
    <View key={local.id} style={styles.listItem}>
      <TouchableOpacity 
        style={styles.listItemHeader}
        onPress={() => toggleExpand(local.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.listIcon, { backgroundColor: `${getMarkerColor(local.categoria)}20` }]}>
          <Ionicons 
            name={getMarkerIcon(local.categoria) as any} 
            size={22} 
            color={getMarkerColor(local.categoria)} 
          />
        </View>
        
        <View style={styles.listContent}>
          <Text style={styles.localTitle}>{local.nome}</Text>
          <View style={styles.localInfo}>
            <Text style={styles.localCategory}>
              {local.categoria.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.localDistance}>
              <Ionicons name="location" size={10} color="#8A2BE2" /> 
              {formatarDistancia(local.distancia)}
            </Text>
          </View>
        </View>
        
        <Ionicons 
          name={expandedItem === local.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#8A2BE2" 
        />
      </TouchableOpacity>

      {expandedItem === local.id && (
        <View style={styles.expandedContent}>
          <Text style={styles.localDescription}>{local.descricao}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.detailLabel}>Horário</Text>
              <Text style={styles.detailValue}>{local.horario_funcionamento}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="call" size={16} color="#666" />
              <Text style={styles.detailLabel}>Telefone</Text>
              <Text style={styles.detailValue}>{local.telefone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.infoText}>{local.endereco}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]}
              onPress={() => ligarParaLocal(local.telefone, local.nome)}
            >
              <Ionicons name="call" size={18} color="#fff" />
              <Text style={styles.buttonText}>Ligar Agora</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.mapButton]}
              onPress={() => abrirMaps(local.endereco, local.latitude, local.longitude, local.nome)}
            >
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.buttonText}>Como Chegar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmergencyNumbers = () => (
    <View style={styles.numbersContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="call" size={24} color="#8A2BE2" />
        <Text style={styles.sectionTitle}>Números de Emergência</Text>
      </View>
      <Text style={styles.sectionSubtitle}>Ligue diretamente em caso de emergência</Text>
      
      <View style={styles.numberGrid}>
        {[
          { service: 'Polícia Militar', number: '190', icon: 'shield', color: '#FF6B6B', desc: 'Emergências policiais' },
          { service: 'Samu', number: '192', icon: 'medical', color: '#4CAF50', desc: 'Ambulância e socorro' },
          { service: 'Bombeiros', number: '193', icon: 'flame', color: '#FF9800', desc: 'Incêndios e resgates' },
          { service: 'Disque Denúncia', number: '181', icon: 'megaphone', color: '#9C27B0', desc: 'Denúncias anônimas' },
          { service: 'Central da Mulher', number: '180', icon: 'female', color: '#8A2BE2', desc: 'Violência doméstica' },
          { service: 'Direitos Humanos', number: '100', icon: 'heart', color: '#2196F3', desc: 'Violação de direitos' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.numberItem} 
            onPress={() => ligarParaLocal(item.number, item.service)}
          >
            <View style={[styles.numberIcon, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.numberTitle}>{item.service}</Text>
            <Text style={styles.number}>{item.number}</Text>
            <Text style={styles.numberDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.loadingText}>Carregando rede de apoio...</Text>
          <Text style={styles.loadingSubtext}>Buscando locais de ajuda próximos</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#8A2BE2']}
            tintColor="#8A2BE2"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderEmergencyButton()}
        
        <View style={styles.listContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#8A2BE2" />
            <Text style={styles.sectionTitle}>
              {permissaoLocalizacao ? 'Locais de Apoio Próximos' : 'Locais de Apoio'}
            </Text>
          </View>
          
          {!permissaoLocalizacao && (
            <View style={styles.permissaoAviso}>
              <Ionicons name="warning" size={16} color="#FF6B6B" />
              <Text style={styles.permissaoAvisoText}>
                Ative a localização para ver os locais mais próximos de você
              </Text>
            </View>
          )}
          
          <View style={styles.locaisInfo}>
            <Text style={styles.locaisCount}>🔍 {locais.length} locais encontrados</Text>
            <Text style={styles.locaisDemo}>(dados simulados para demonstração)</Text>
          </View>
          
          {locais.map(renderLocalItem)}
        </View>

        {renderEmergencyNumbers()}

        {/* Informações de Demonstração */}
        <View style={styles.demoContainer}>
          <View style={styles.demoHeader}>
            <Ionicons name="information-circle" size={20} color="#E65100" />
            <Text style={styles.demoTitle}>Informações da Demonstração</Text>
          </View>
          <Text style={styles.demoText}>
            • Todos os dados são simulados para teste{'\n'}
            • O botão de emergência simula envio de alerta{'\n'}
            • Localização baseada em Pelotas/RS{'\n'}
            • Funcionalidades reais: ligações e navegação
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#8A2BE2',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  headerUserName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  localizacaoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
  },
  demoBadgeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '700',
  },
  emergencyContainer: {
    padding: 24,
    paddingTop: 0,
  },
  emergencyButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  emergencyGradient: {
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
  },
  emergencyLoading: {
    alignItems: 'center',
    gap: 12,
  },
  emergencyLoadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyIcon: {
    marginBottom: 12,
  },
  emergencyText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 1,
  },
  emergencySubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  emergencyDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyDemoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  listContainer: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8A2BE2',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissaoAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  permissaoAvisoText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  locaisInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locaisCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 4,
  },
  locaisDemo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  localTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  localInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  localCategory: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '700',
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  localDistance: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  expandedContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  localDescription: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  mapButton: {
    backgroundColor: '#8A2BE2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  numbersContainer: {
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  numberItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  numberIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  number: {
    fontSize: 20,
    fontWeight: '800',
    color: '#8A2BE2',
    marginBottom: 4,
  },
  numberDesc: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 14,
  },
  demoContainer: {
    backgroundColor: '#FFF3E0',
    margin: 24,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
  },
  demoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Ajuda;