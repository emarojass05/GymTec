import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function ClientesInstructor() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cedIns, setCedIns]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const ced = await AsyncStorage.getItem('cedulaEmpleado');
        console.log('🔍 cedulaEmpleado from storage:', ced);
        if (!ced) {
          Alert.alert('Error', 'No hay instructor en sesión.');
          return;
        }
        setCedIns(+ced);

        const res  = await fetch(`${apiUrl}/Cliente`);
        const data = await res.json();
        console.log('📋 clientes raw:', data);
        setClientes(data);
      } catch (err) {
        console.error('❌ Error al cargar clientes:', err);
        Alert.alert('Error', 'No fue posible cargar los datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAsignar = cedulaCliente => {
    console.log('▶ handleAsignar invoked for cliente', cedulaCliente, 'with instructor', cedIns);

    const doAssign = async () => {
      console.log('➡️ doAssign called');
      try {
        const url = `${apiUrl}/Cliente/${cedulaCliente}/AsignarInstructor/${cedIns}`;
        console.log('🔗 Fetching URL:', url);
        const resp = await fetch(url, { method: 'POST' });
        console.log('🔄 Response status:', resp.status);
        if (resp.ok) {
          console.log('✅ Asignación exitosa en backend');
          setClientes(list =>
            list.map(c =>
              c.cedulaCliente === cedulaCliente
                ? { ...c, idInstructor: cedIns, instructorName: 'tú mismo' }
                : c
            )
          );
          Alert.alert('Éxito', 'Cliente asignado correctamente.');
        } else {
          const msg = await resp.text();
          console.warn('⚠️ Error desde backend:', msg);
          Alert.alert('Error', msg);
        }
      } catch (err) {
        console.error('❌ Exception en doAssign:', err);
        Alert.alert('Error', 'No se pudo conectar al servidor.');
      }
    };

    if (Platform.OS === 'web') {
      console.log('🌐 Platform is web, using window.confirm');
      const ok = window.confirm('¿Asignarás este cliente a tu lista?');
      console.log('❔ window.confirm result:', ok);
      if (ok) doAssign();
    } else {
      console.log('📱 Platform is mobile, using Alert.alert');
      Alert.alert(
        'Confirmación',
        '¿Asignarás este cliente a tu lista?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => console.log('🚫 Usuario canceló asignación')
          },
          { text: 'Aceptar', onPress: () => { console.log('✅ Usuario confirmó asignación'); doAssign(); } }
        ],
        { cancelable: true }
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={clientes}
      keyExtractor={item => item.cedulaCliente.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>
            {item.nombreCliente} {item.apellidosCliente}
          </Text>
          <Text>Cédula: {item.cedulaCliente}</Text>
          <Text>Instructor: {item.instructorName}</Text>
          {!item.idInstructor && (
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => {
                console.log('🖱️ onPress Registrarse for', item.cedulaCliente);
                handleAsignar(item.cedulaCliente);
              }}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>No hay clientes disponibles.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, backgroundColor: '#fff' },
  card:      {
               backgroundColor: '#fafafa',
               padding: 16,
               borderRadius: 8,
               marginBottom: 12,
               borderWidth: 1,
               borderColor: '#ddd'
             },
  name:      { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  button:    {
               marginTop: 8,
               backgroundColor: '#28a745',
               padding: 10,
               borderRadius: 6
             },
  buttonText:{ color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  empty:     { textAlign: 'center', marginTop: 20, fontSize: 16 }
});
