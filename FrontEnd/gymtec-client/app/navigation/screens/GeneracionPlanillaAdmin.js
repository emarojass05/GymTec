import { StyleSheet, Text, View } from 'react-native';

export default function GeneracionPlanillaAdmin() {
  return (
    <View style={styles.container}>
      <Text>Página para generación de planillas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' }
});
