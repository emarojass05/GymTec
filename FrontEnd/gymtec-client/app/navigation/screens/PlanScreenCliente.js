import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function PlanScreen() {
  const [clasesInfo, setClasesInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const cedula = await AsyncStorage.getItem('cedulaCliente');
        if (!cedula) {
          setLoading(false);
          return;
        }

        // 1) Obtener todas las asistencias del cliente
        const respA = await fetch(`${apiUrl}/AsistenciaClase`);
        const asistencias = await respA.json();
        const misAsistencias = asistencias.filter(
          a => a.cedulaCliente === parseInt(cedula, 10)
        );

        // 2) Por cada asistencia, obtener datos de Clase, Servicio, Empleado y Sucursal
        const detalles = await Promise.all(
          misAsistencias.map(async ({ idClase }) => {
            // Clase
            const respC = await fetch(`${apiUrl}/Clase/${idClase}`);
            if (!respC.ok) return null;
            const clase = await respC.json();

            // Servicio (tipo de clase)
            const respSvc = await fetch(`${apiUrl}/Servicio/${clase.tipoClase}`);
            const servicio = respSvc.ok ? await respSvc.json() : null;

            // Instructor
            const respI = await fetch(`${apiUrl}/Empleado/${clase.idInstructorClase}`);
            const instructor = respI.ok ? await respI.json() : null;

            // Sucursal
            const respS = await fetch(`${apiUrl}/Sucursal/${clase.idSucursal}`);
            const sucursal = respS.ok ? await respS.json() : null;

            return {
              idClase: clase.idClase,
              tipoClaseDesc: servicio ? servicio.descripcionServicio : 'N/D',
              grupal: clase.grupal,
              capacidad: clase.capacidadClase,
              fecha: clase.fechaClase,
              inicio: clase.horaInicioClase,
              fin: clase.horaFinalizacionClase,
              instructorNombre: instructor
                ? `${instructor.nombreEmpleado} ${instructor.apellidosEmpleado}`
                : 'N/D',
              sucursalDireccion: sucursal
                ? sucursal.direccionSucursal
                : 'N/D'
            };
          })
        );

        setClasesInfo(detalles.filter(Boolean));
      } catch (err) {
        console.error('Error cargando plan:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  const formatDate = iso => new Date(iso).toLocaleDateString();
  const formatTime = t => t.slice(0,5);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (clasesInfo.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mis Clases Asistidas</Text>
        <Text style={styles.text}>No hay registros de asistencia.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Clases Asistidas</Text>
      {clasesInfo.map(info => (
        <View key={info.idClase} style={styles.card}>
          <Text style={styles.cardTitle}>Clase #{info.idClase}</Text>
          <Text>Tipo de clase: {info.tipoClaseDesc}</Text>
          <Text>Grupal: {info.grupal ? 'Sí' : 'No'}</Text>
          <Text>Capacidad: {info.capacidad}</Text>
          <Text>Fecha: {formatDate(info.fecha)}</Text>
          <Text>
            Hora: {formatTime(info.inicio)} – {formatTime(info.fin)}
          </Text>
          <Text>Instructor: {info.instructorNombre}</Text>
          <Text>Sucursal: {info.sucursalDireccion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    padding: 24,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12
  },
  text: {
    fontSize: 16,
    marginBottom: 8
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  }
});
