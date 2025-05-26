import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a GymTEC!</Text>
      <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Plan')}>
        <Text style={styles.buttonText}>Ver Plan de Trabajo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Clases')}>
        <Text style={styles.buttonText}>Ver Clases Disponibles</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Perfil')}>
        <Text style={styles.buttonText}>Mi Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    marginVertical: 6,
    width: '80%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  logout: { backgroundColor: '#FF3B30', marginTop: 20 },
});
