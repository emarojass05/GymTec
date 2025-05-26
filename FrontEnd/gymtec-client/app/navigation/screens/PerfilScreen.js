import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PerfilScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.text}>Nombre: Juan Pérez</Text>
      <Text style={styles.text}>Correo: juan@example.com</Text>
      <Text style={styles.text}>IMC: 22.5</Text>

      <TouchableOpacity style={styles.logout} onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
  logout: { marginTop: 30, backgroundColor: '#FF3B30', padding: 12, borderRadius: 6 },
  logoutText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
