import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreenInstructor({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, Instructor!</Text>
      <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ClientesInstructor')}
      >
        <Text style={styles.buttonText}>Ver Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PlanesInstructor')}
      >
        <Text style={styles.buttonText}>Planes de Trabajo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ClasesInstructor')}
      >
        <Text style={styles.buttonText}>Clases</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logout]}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title:      { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle:   { fontSize: 16, marginBottom: 20 },
  button:     {
                backgroundColor: '#007AFF',
                padding: 14,
                borderRadius: 8,
                marginVertical: 6,
                width: '80%',
              },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  logout:     { backgroundColor: '#FF3B30', marginTop: 20 },
});
