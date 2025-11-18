// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './src/navigation/AppStack'; // Corrigir o caminho

export default function App() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}