import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { apiUrl } from '../../../utils';

export default function ServiciosAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/Servicio`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data}
      keyExtractor={item => item.idServicio.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>{item.descripcionServicio}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay servicios.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 },
  card:      {
               padding: 16,
               marginBottom: 12,
               backgroundColor: '#fafafa',
               borderRadius: 6
             },
  empty:     { textAlign: 'center', marginTop: 20 }
});
