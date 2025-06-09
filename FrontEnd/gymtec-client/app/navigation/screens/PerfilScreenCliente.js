import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function PerfilScreen({ navigation }) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const cedula = await AsyncStorage.getItem('cedulaCliente');
        if (!cedula) {
          Alert.alert('Error', 'No se encontró sesión activa.');
          navigation.replace('Login');
          return;
        }

        const resp = await fetch(`${apiUrl}/Cliente/${cedula}`);
        if (!resp.ok) {
          Alert.alert('Error', 'No se pudo cargar el perfil.');
          return;
        }

        const data = await resp.json();
        setCliente(data);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        Alert.alert('Error', 'Fallo la conexión al servidor.');
      } finally {
        setLoading(false);
      }
    };

    loadPerfil();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No hay datos de perfil.</Text>
        <TouchableOpacity style={styles.logout} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.text}>
        Nombre: {cliente.nombreCliente} {cliente.apellidosCliente}
      </Text>
      <Text style={styles.text}>
        Correo: {cliente.correoCliente}
      </Text>
      <Text style={styles.text}>
        IMC: {cliente.imcCliente.toFixed(1)}
      </Text>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => {
          AsyncStorage.removeItem('cedulaCliente');
          navigation.replace('Login');
        }}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
  logout: { marginTop: 30, backgroundColor: '#FF3B30', padding: 12, borderRadius: 6 },
  logoutText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
