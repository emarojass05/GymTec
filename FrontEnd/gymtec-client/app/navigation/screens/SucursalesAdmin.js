import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function SucursalesAdmin({ navigation }) {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/Sucursal`)
      .then(res => res.json())
      .then(setSucursales)
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar sucursales.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={sucursales}
      keyExtractor={item => item.idSucursal.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('SucursalDetailAdmin', {
            idSucursal: item.idSucursal
          })}
        >
          <Text style={styles.text}>{item.direccionSucursal}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay sucursales.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { padding:20, backgroundColor:'#fff' },
  item:      {
               padding:16,
               backgroundColor:'#fafafa',
               borderRadius:6,
               marginBottom:10
             },
  text:      { fontSize:16 },
  empty:     { textAlign:'center', marginTop:20 }
});
