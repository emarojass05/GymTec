import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor completa ambos campos.');
      return;
    }

    // 1) Hashear la contraseña con MD5
    const hashedPassword = CryptoJS.MD5(password).toString();

    try {
      // 2) Llamar al endpoint de autenticación
      const url = `${apiUrl}/Cliente/Authenticate?correo=${encodeURIComponent(correo)}&password=${encodeURIComponent(hashedPassword)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.status === 200) {
        const clienteData = await response.json();
        console.log('Cliente obtenido desde API:', clienteData);

        // 3) Guardar cédula en AsyncStorage
        await AsyncStorage.setItem('cedulaCliente', clienteData.cedulaCliente.toString());

        // 4) Navegar a Home
        navigation.navigate('Home');
      } else if (response.status === 401) {
        Alert.alert('Error', 'Credenciales incorrectas.');
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Falló la autenticación: ${errorText}`);
      }
    } catch (err) {
      console.error('Error al consumir la API:', err);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/GymTec-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
  },
  secondaryButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
