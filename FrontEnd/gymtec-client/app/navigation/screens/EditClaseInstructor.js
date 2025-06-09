import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert, ScrollView, StyleSheet,
    Switch,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function EditClaseInstructor({ route, navigation }) {
  const { idClase } = route.params;
  const [loading, setLoading] = useState(true);

  // Original fetched class
  const [original, setOriginal] = useState(null);

  // Lookup lists
  const [servicios, setServicios]   = useState([]);
  const [instructores, setInstrs]   = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // Input states (empty = no change)
  const [tipoDescInput, setTipoDescInput]             = useState('');
  const [instructorNameInput, setInstructorNameInput] = useState('');
  const [sucursalNameInput, setSucursalNameInput]     = useState('');
  const [grupal, setGrupal]                           = useState(false);
  const [capacidadInput, setCapacidadInput]           = useState('');
  const [fechaInput, setFechaInput]                   = useState(''); // YYYY-MM-DD
  const [inicioInput, setInicioInput]                 = useState(''); // HH:mm:ss
  const [finInput, setFinInput]                       = useState(''); // HH:mm:ss

  useEffect(() => {
    (async () => {
      try {
        // Load lookup lists in parallel
        const [svcRes, instRes, sucRes] = await Promise.all([
          fetch(`${apiUrl}/Servicio`),
          fetch(`${apiUrl}/Empleado`),
          fetch(`${apiUrl}/Sucursal`)
        ]);
        const [svcList, instList, sucList] = await Promise.all([
          svcRes.json(), instRes.json(), sucRes.json()
        ]);
        setServicios(svcList);
        setInstrs(instList);
        setSucursales(sucList);

        // Fetch original class
        const cRes = await fetch(`${apiUrl}/Clase/${idClase}`);
        if (!cRes.ok) throw new Error();
        const c = await cRes.json();
        setOriginal(c);
        setGrupal(c.grupal);
      } catch (err) {
        Alert.alert('Error','No se pudo cargar la clase.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [idClase]);

  const handleSave = async () => {
    try {
      // Determine IDs: if input non-empty & matches lookup, else use original
      const svc   = tipoDescInput.trim()
                    ? servicios.find(s => s.descripcionServicio === tipoDescInput.trim())
                    : servicios.find(s => s.idServicio === original.tipoClase);
      const inst  = instructorNameInput.trim()
                    ? instructores.find(i =>
                        `${i.nombreEmpleado} ${i.apellidosEmpleado}` === instructorNameInput.trim()
                      )
                    : instructores.find(i => i.cedulaEmpleado === original.idInstructorClase);
      const suc   = sucursalNameInput.trim()
                    ? sucursales.find(su => su.direccionSucursal === sucursalNameInput.trim())
                    : sucursales.find(su => su.idSucursal === original.idSucursal);

      if (!svc || !inst || !suc) {
        return Alert.alert('Error','Servicio, Instructor o Sucursal no válido.');
      }

      // Build merged payload
      const body = {
        idClase:               original.idClase,
        tipoClase:             svc.idServicio,
        idInstructorClase:     inst.cedulaEmpleado,
        grupal,
        capacidadClase:        capacidadInput.trim()
                                ? parseInt(capacidadInput,10)
                                : original.capacidadClase,
        fechaClase:            fechaInput.trim()
                                ? new Date(fechaInput).toISOString()
                                : original.fechaClase,
        horaInicioClase:       inicioInput.trim()
                                ? inicioInput
                                : original.horaInicioClase,
        horaFinalizacionClase: finInput.trim()
                                ? finInput
                                : original.horaFinalizacionClase,
        idSucursal:            suc.idSucursal
      };

      const resp = await fetch(`${apiUrl}/Clase/${idClase}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });

      if (resp.ok) {
              Alert.alert('Éxito','Clase actualizada.',[
         { text:'OK', onPress:() => navigation.navigate('HomeInstructor') }
       ]);
      } else {
        const t = await resp.text();
        Alert.alert('Error', `Fallo: ${t}`);
      }
    } catch {
      Alert.alert('Error','No se pudo conectar al servidor.');
    }
  };

  if (loading || !original) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tipo de Clase</Text>
      <TextInput
        style={styles.input}
        placeholder={servicios.find(s=>s.idServicio===original.tipoClase)?.descripcionServicio}
        value={tipoDescInput}
        onChangeText={setTipoDescInput}
      />

      <Text style={styles.label}>Instructor</Text>
      <TextInput
        style={styles.input}
        placeholder={`${original.idInstructorClase}`}
        value={instructorNameInput}
        onChangeText={setInstructorNameInput}
      />

      <Text style={styles.label}>Sucursal</Text>
      <TextInput
        style={styles.input}
        placeholder={sucursales.find(su=>su.idSucursal===original.idSucursal)?.direccionSucursal}
        value={sucursalNameInput}
        onChangeText={setSucursalNameInput}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Grupal</Text>
        <Switch value={grupal} onValueChange={setGrupal} />
      </View>

      <Text style={styles.label}>Capacidad</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder={original.capacidadClase.toString()}
        value={capacidadInput}
        onChangeText={setCapacidadInput}
      />

      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder={original.fechaClase.slice(0,10)}
        value={fechaInput}
        onChangeText={setFechaInput}
      />

      <Text style={styles.label}>Hora Inicio (HH:mm:ss)</Text>
      <TextInput
        style={styles.input}
        placeholder={original.horaInicioClase}
        value={inicioInput}
        onChangeText={setInicioInput}
      />

      <Text style={styles.label}>Hora Fin (HH:mm:ss)</Text>
      <TextInput
        style={styles.input}
        placeholder={original.horaFinalizacionClase}
        value={finInput}
        onChangeText={setFinInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  center:       { flex:1, justifyContent:'center', alignItems:'center' },
  container:    { padding:20, backgroundColor:'#fff' },
  label:        { marginTop:12, fontWeight:'600' },
  input:        {
                  backgroundColor:'#eee',
                  borderRadius:6,
                  padding:8,
                  marginTop:4
                },
  switchRow:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:12 },
  button:       { backgroundColor:'#007AFF', padding:14, borderRadius:8, marginTop:20 },
  buttonText:   { color:'#fff', textAlign:'center', fontWeight:'bold' }
});
