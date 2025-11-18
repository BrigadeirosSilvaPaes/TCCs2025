import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Painel from '../screens/painel';
import Configuracao from '../screens/configuracao';
import Projeto from '../screens/projeto';
import Home from '../screens/home';
import CustomDrawer from './CustomDrawer';
import { DrawerParamList } from './types';
import Ajuda from '../screens/ajuda';
import { MaterialIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator<DrawerParamList>();

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerTitleAlign: 'center',
        swipeEnabled: true,
      }}
      initialRouteName="Painel" // Alterado para "Painel" (com P maiúsculo)
    >
      <Drawer.Screen 
        name="Painel" 
        component={Painel}
        options={{
          title: 'Painel',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Configuracao" 
        component={Configuracao}
        options={{
          title: 'Configurações',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Projeto" 
        component={Projeto}
        options={{
          title: 'Projeto',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="lightbulb" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Ajuda" 
        component={Ajuda}
        options={{
          title: 'Ajuda',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="help" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default AppDrawer;