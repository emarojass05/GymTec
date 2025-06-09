import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function ClasesInstructor({ navigation }) {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) ID del instructor desde sesión
        const cedIns = await AsyncStorage.getItem('cedulaEmpleado');
        if (!cedIns) {
          navigation.replace('Login');
          return;
        }

        // 2) Todas las clases de ese instructor
        const resp = await fetch(`${apiUrl}/Clase`);
        const data = await resp.json();
        const propias = data.filter(
          c => c.idInstructorClase === parseInt(cedIns, 10)
        );

        // 3) Para cada una, traer descripción de tipo, nombre de instructor y sucursal
        const detalles = await Promise.all(
          propias.map(async c => {
            const [svcRes, instRes, sucRes] = await Promise.all([
              fetch(`${apiUrl}/Servicio/${c.tipoClase}`),
              fetch(`${apiUrl}/Empleado/${c.idInstructorClase}`),
              fetch(`${apiUrl}/Sucursal/${c.idSucursal}`)
            ]);
            const servicio   = svcRes.ok ? await svcRes.json() : null;
            const instructor = instRes.ok ? await instRes.json() : null;
            const sucursal   = sucRes.ok ? await sucRes.json() : null;

            return {
              id:        c.idClase,
              tipoDesc:  servicio?.descripcionServicio  ?? '–',
              instructorName:
                         instructor
                           ? `${instructor.nombreEmpleado} ${instructor.apellidosEmpleado}`
                           : '–',
              sucursalName:
                         sucursal?.direccionSucursal     ?? '–',
              grupal:    c.grupal,
              capacidad: c.capacidadClase,
              fecha:     c.fechaClase,
              inicio:    c.horaInicioClase,
              fin:       c.horaFinalizacionClase
            };
          })
        );

        setClases(detalles);
      } catch (err) {
        console.error('Error cargando clases:', err);
      } finally {
        setLoading(false);
      }
    })();
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
      data={clases}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('EditClaseInstructor', { idClase: item.id })
          }
        >
          <Text style={styles.title}>{item.tipoDesc}</Text>
          <Text>Instructor: {item.instructorName}</Text>
          <Text>Sucursal: {item.sucursalName}</Text>
          <Text>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
          <Text>
            Hora: {item.inicio.slice(0,5)} – {item.fin.slice(0,5)}
          </Text>
          <Text>Grupal: {item.grupal ? 'Sí' : 'No'}</Text>
          <Text>Cupos: {item.capacidad}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>No tienes clases asignadas.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { padding:20, backgroundColor:'#fff' },
  card:      {
               backgroundColor:'#fafafa',
               padding:16,
               borderRadius:8,
               marginBottom:12,
               borderWidth:1,
               borderColor:'#ddd'
             },
  title:     { fontSize:18, fontWeight:'600', marginBottom:4 },
  empty:     { textAlign:'center', marginTop:20, fontSize:16 }
});
