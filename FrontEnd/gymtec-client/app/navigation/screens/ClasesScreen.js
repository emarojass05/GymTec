import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const clases = [
  { id: '1', tipo: 'Yoga', instructor: 'Ana', horario: 'Lunes 9am' },
  { id: '2', tipo: 'Zumba', instructor: 'Luis', horario: 'Martes 6pm' },
  { id: '3', tipo: 'Indoor Cycling', instructor: 'Carlos', horario: 'Miércoles 7am' },
];

export default function ClasesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clases Disponibles</Text>
      <FlatList
        data={clases}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.clase}>{item.tipo}</Text>
            <Text>Instructor: {item.instructor}</Text>
            <Text>Horario: {item.horario}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Inscribirse</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: '#f2f2f2', padding: 12, borderRadius: 6, marginBottom: 12 },
  clase: { fontSize: 18, fontWeight: 'bold' },
  button: { marginTop: 8, backgroundColor: '#007AFF', padding: 10, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
