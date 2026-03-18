import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PetProvider } from './src/context/PetContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PetProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </PetProvider>
    </SafeAreaProvider>
  );
}
