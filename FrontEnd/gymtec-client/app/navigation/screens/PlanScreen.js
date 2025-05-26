import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Plan de Trabajo</Text>
      <Text style={styles.text}>📅 Lunes: Cardio + Core</Text>
      <Text style={styles.text}>📅 Miércoles: Pesas + Piernas</Text>
      <Text style={styles.text}>📅 Viernes: Yoga</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 8 },
});
