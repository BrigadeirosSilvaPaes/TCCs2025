// src/navigation/AppStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Login from '../screens/login';
import Cadastro from '../screens/cadastro';
import Esqueci from '../screens/EsqueciSenha';
import AppDrawer from './AppDrawer';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"  
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' 
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Esqueci" component={Esqueci} />
      <Stack.Screen 
        name="MainApp" 
        component={AppDrawer}
        options={{
          gestureEnabled: false, // Impede voltar para login com gesto
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStack;