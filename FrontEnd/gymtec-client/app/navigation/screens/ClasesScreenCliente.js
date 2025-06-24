import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function ClasesScreen() {
  const [searchSucursal, setSearchSucursal] = useState('');
  const [searchTipo, setSearchTipo] = useState('');
  const [searchInicio, setSearchInicio] = useState('');
  const [searchFin, setSearchFin] = useState('');
  const [clasesInfo, setClasesInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const formatDate = iso => new Date(iso).toLocaleDateString();
  const formatTime = t => t.slice(0, 5);

  async function handleSearch() {
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/Clase`);
      const clases = await resp.json();

      const detalles = await Promise.all(
        clases.map(async c => {
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
            tipoDesc:  servicio?.descripcionServicio ?? '',
            capacidad: c.capacidadClase,
            fecha:     c.fechaClase,
            inicio:    c.horaInicioClase,
            fin:       c.horaFinalizacionClase,
            instructor:
              instructor
                ? `${instructor.nombreEmpleado}`
                : 'N/D',
            sucursal: sucursal?.direccionSucursal ?? '',
            // Guardamos referencia al objeto completo de clase original para hacer PUT luego
            _claseRaw: c
          };
        })
      );

      // aplicamos filtros de búsqueda
      const filtradas = detalles.filter(info => {
        const fechaObj = new Date(info.fecha);
        const okSuc = !searchSucursal ||
          info.sucursal.toLowerCase().includes(searchSucursal.toLowerCase());
        const okTipo = !searchTipo ||
          info.tipoDesc.toLowerCase().includes(searchTipo.toLowerCase());
        const okIni = !searchInicio || fechaObj >= new Date(searchInicio);
        const okFin = !searchFin   || fechaObj <= new Date(searchFin);
        return okSuc && okTipo && okIni && okFin;
      });

      setClasesInfo(filtradas);
    } catch (err) {
      console.error('Error buscando clases:', err);
    } finally {
      setLoading(false);
    }
  }

  function confirmInscripcion(idClase) {
    if (Platform.OS === 'web') {
      const ok = window.confirm('¿Seguro que te quieres registrar en esta clase?');
      if (ok) handleInscripcion(idClase);
    } else {
      Alert.alert(
        'Confirmación',
        '¿Seguro que te quieres registrar en esta clase?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Sí', onPress: () => handleInscripcion(idClase) }
        ],
        { cancelable: false }
      );
    }
  }

  async function handleInscripcion(idClase) {
    try {
      const cedula = await AsyncStorage.getItem('cedulaCliente');
      if (!cedula) {
        Alert.alert('Error', 'No se encontró la cédula del cliente.');
        return;
      }

      // Encuentra la info de la clase
      const claseInfo = clasesInfo.find(ci => ci.id === idClase);
      if (!claseInfo || claseInfo.capacidad <= 0) {
        Alert.alert('Error', 'La clase no tiene cupos disponibles.');
        return;
      }

      // 1. Anotar la asistencia
      const payload = { CedulaCliente: +cedula, IdClase: idClase };
      const resp = await fetch(`${apiUrl}/AsistenciaClase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        // 2. Disminuir la capacidad (PUT)
        const nuevaCapacidad = claseInfo.capacidad - 1;
        const updatedClase = {
          ...claseInfo._claseRaw,
          capacidadClase: nuevaCapacidad
        };
        const putResp = await fetch(`${apiUrl}/Clase/${idClase}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedClase)
        });

        if (!putResp.ok) {
          Alert.alert('Advertencia', 'La inscripción fue anotada, pero no se pudo actualizar la capacidad.');
        }

        // Actualiza la UI localmente
        setClasesInfo(list =>
          list.map(info =>
            info.id === idClase
              ? { ...info, capacidad: nuevaCapacidad, _claseRaw: { ...info._claseRaw, capacidadClase: nuevaCapacidad } }
              : info
          )
        );

        Alert.alert('Éxito', 'Te has inscrito correctamente.');
      } else if (resp.status === 409) {
        const msg = await resp.text();
        Alert.alert('Atención', msg);
      } else {
        const text = await resp.text();
        Alert.alert('Error', `No se pudo inscribir: ${text}`);
      }
    } catch (err) {
      console.error('Error en inscripción:', err);
      Alert.alert('Error', 'Falló la conexión al servidor.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Búsqueda de Clases</Text>

      <TextInput
        style={styles.input}
        placeholder="Sucursal (nombre o dirección)"
        value={searchSucursal}
        onChangeText={setSearchSucursal}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de clase (Yoga, Zumba...)"
        value={searchTipo}
        onChangeText={setSearchTipo}
      />

      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          placeholder="Fecha inicio (YYYY-MM-DD)"
          value={searchInicio}
          onChangeText={setSearchInicio}
        />
        <TextInput
          style={styles.inputHalf}
          placeholder="Fecha fin (YYYY-MM-DD)"
          value={searchFin}
          onChangeText={setSearchFin}
        />
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
          {clasesInfo.length > 0 ? (
            clasesInfo.map(info => (
              <View key={info.id} style={styles.card}>
                <Text style={styles.cardTitle}>{info.tipoDesc}</Text>
                <Text>Instructor: {info.instructor}</Text>
                <Text>Sucursal: {info.sucursal}</Text>
                <Text>Fecha: {formatDate(info.fecha)}</Text>
                <Text>
                  Hora: {formatTime(info.inicio)} – {formatTime(info.fin)}
                </Text>
                <Text>Cupos disponibles: {info.capacidad}</Text>
                {info.capacidad > 0 && (
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => confirmInscripcion(info.id)}
                  >
                    <Text style={styles.buttonText}>Inscribirse</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noResults}>No se encontraron clases.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, padding: 16, backgroundColor: '#fff' },
  title:            { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input:            { backgroundColor: '#eee', padding: 8, marginVertical: 6, borderRadius: 6 },
  row:              { flexDirection: 'row', justifyContent: 'space-between' },
  inputHalf:        { flex: 1, backgroundColor: '#eee', padding: 8, marginVertical: 6, marginRight: 6, borderRadius: 6 },
  searchButton:     { backgroundColor: '#007AFF', padding: 12, borderRadius: 6, marginTop: 8 },
  searchButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  card:             { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fafafa' },
  cardTitle:        { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  button:           { marginTop: 8, backgroundColor: '#28a745', padding: 10, borderRadius: 6 },
  buttonText:       { color: '#fff', textAlign: 'center' },
  noResults:        { textAlign: 'center', marginTop: 20, fontSize: 16 }
});
