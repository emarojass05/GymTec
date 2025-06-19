// App.js
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import { initLocalDB } from './app/localdb';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      (async () => {
        await initLocalDB();
      })();
    }
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
