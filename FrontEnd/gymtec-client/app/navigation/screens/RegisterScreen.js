import CryptoJS from 'crypto-js';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function RegisterScreen({ navigation }) {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(''); // YYYY-MM-DD
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (
      !cedula || !nombre || !apellidos ||
      !fechaNacimiento || !peso || !imc ||
      !direccion || !correo || !password
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Hash de la contraseña (opcional)
    const hashedPassword = CryptoJS.MD5(password).toString();

    // Prepara el payload según tu modelo Cliente
    const payload = {
      CedulaCliente: parseInt(cedula, 10),
      NombreCliente: nombre,
      ApellidosCliente: apellidos,
      FechaNacimiento: new Date(fechaNacimiento).toISOString(),
      PesoCliente: parseFloat(peso),
      IMCCliente: parseFloat(imc),
      DireccionCliente: direccion,
      CorreoCliente: correo,
      PasswordCliente: hashedPassword
    };

    console.log('Payload registro:', payload);

    try {
      const baseURL = `${apiUrl}/Cliente`;
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 201 || response.status === 200) {
        const created = await response.json();
        console.log('Cliente creado:', created);
        Alert.alert('Éxito', 'Registro completado correctamente.');
        navigation.goBack();
      } else if (response.status === 409) {
        const err = await response.text();
        Alert.alert('Error', `Ya existe un cliente: ${err}`);
      } else {
        const err = await response.text();
        Alert.alert('Error', `Fallo al registrar: ${err}`);
      }
    } catch (error) {
      console.error('Error en POST /api/Cliente:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>

      <TextInput
        placeholder="Cédula"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setCedula}
        value={cedula}
      />
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        onChangeText={setNombre}
        value={nombre}
      />
      <TextInput
        placeholder="Apellidos"
        style={styles.input}
        onChangeText={setApellidos}
        value={apellidos}
      />
      <TextInput
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        style={styles.input}
        onChangeText={setFechaNacimiento}
        value={fechaNacimiento}
      />
      <TextInput
        placeholder="Peso (kg)"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPeso}
        value={peso}
      />
      <TextInput
        placeholder="IMC"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setImc}
        value={imc}
      />
      <TextInput
        placeholder="Dirección"
        style={styles.input}
        onChangeText={setDireccion}
        value={direccion}
      />
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setCorreo}
        value={correo}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
