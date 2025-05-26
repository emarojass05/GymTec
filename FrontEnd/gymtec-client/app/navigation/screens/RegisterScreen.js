import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import CryptoJS from 'crypto-js';

export default function RegisterScreen({ navigation }) {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [edad, setEdad] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (
      !cedula || !nombre || !apellidos || !edad ||
      !fechaNacimiento || !peso || !imc || !direccion || !correo || !password
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const hashedPassword = CryptoJS.MD5(password).toString();

    console.log('Usuario registrado:', {
      cedula,
      nombre,
      apellidos,
      edad,
      fechaNacimiento,
      peso,
      imc,
      direccion,
      correo,
      hashedPassword
    });

    Alert.alert('Éxito', 'Registro completado correctamente.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>

      <TextInput placeholder="Cédula" style={styles.input} onChangeText={setCedula} value={cedula} />
      <TextInput placeholder="Nombre" style={styles.input} onChangeText={setNombre} value={nombre} />
      <TextInput placeholder="Apellidos" style={styles.input} onChangeText={setApellidos} value={apellidos} />
      <TextInput placeholder="Edad" style={styles.input} keyboardType="numeric" onChangeText={setEdad} value={edad} />
      <TextInput placeholder="Fecha de nacimiento (YYYY-MM-DD)" style={styles.input} onChangeText={setFechaNacimiento} value={fechaNacimiento} />
      <TextInput placeholder="Peso (kg)" style={styles.input} keyboardType="numeric" onChangeText={setPeso} value={peso} />
      <TextInput placeholder="IMC" style={styles.input} keyboardType="numeric" onChangeText={setImc} value={imc} />
      <TextInput placeholder="Dirección" style={styles.input} onChangeText={setDireccion} value={direccion} />
      <TextInput placeholder="Correo electrónico" style={styles.input} keyboardType="email-address" onChangeText={setCorreo} value={correo} />
      <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry onChangeText={setPassword} value={password} />

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
