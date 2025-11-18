import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  Esqueci: undefined;
  MainApp: NavigatorScreenParams<DrawerParamList>;
};

export type DrawerParamList = {
  Home: undefined; // Adicionei Home aqui
  Painel: undefined;
  Configuracao: undefined;
  Projeto: undefined;
  Ajuda: undefined;
};

// Extensão para useNavigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}