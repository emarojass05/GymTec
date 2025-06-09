import { StyleSheet, Text, View } from 'react-native';

export default function CalendarioAdmin() {
  return (
    <View style={styles.container}>
      <Text>Calendario de eventos del gimnasio.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' }
});
