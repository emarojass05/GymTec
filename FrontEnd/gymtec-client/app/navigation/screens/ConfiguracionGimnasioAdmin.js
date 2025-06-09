import { StyleSheet, Text, View } from 'react-native';

export default function ConfiguracionGimnasioAdmin() {
  return (
    <View style={styles.container}>
      <Text>Aquí van las configuraciones del gimnasio.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' }
});
