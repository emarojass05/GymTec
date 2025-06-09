// app/navigation/screens/CalendarioAdmin.js
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function CalendarioAdmin() {
  const [sourceWeek, setSourceWeek] = useState('');
  const [targetWeek, setTargetWeek] = useState('');
  const [loading, setLoading]       = useState(false);

  const handleCopy = async () => {
    if (!sourceWeek || !targetWeek) {
      Alert.alert('Error', 'Por favor ingrese ambas fechas.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/Clase/CopyWeek?sourceWeek=${encodeURIComponent(sourceWeek)}&targetWeek=${encodeURIComponent(targetWeek)}`,
        { method: 'POST' }
      );
      if (res.ok) {
        Alert.alert('Éxito', 'Calendario copiado satisfactoriamente.');
      } else {
        const txt = await res.text();
        Alert.alert('Error', txt || 'No se pudo copiar el calendario.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Copiar Calendario de Actividades</Text>

      <TextInput
        style={styles.input}
        placeholder="Semana Origen (YYYY-MM-DD)"
        value={sourceWeek}
        onChangeText={setSourceWeek}
      />

      <TextInput
        style={styles.input}
        placeholder="Semana Destino (YYYY-MM-DD)"
        value={targetWeek}
        onChangeText={setTargetWeek}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCopy}>
          <Text style={styles.buttonText}>Copiar Calendario</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title:       { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input:       {
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 6,
                 padding: 12,
                 marginBottom: 12
               },
  button:      {
                 backgroundColor: '#007AFF',
                 padding: 14,
                 borderRadius: 8,
                 alignItems: 'center'
               },
  buttonText:  { color: '#fff', fontWeight: 'bold' },
  loader:      { marginTop: 16 }
});
