import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function SucursalDetailAdmin({ route, navigation }) {
  const { idSucursal } = route.params;

  const [loading, setLoading] = useState(true);
  const [direccion, setDireccion] = useState('');
  const [fechaApertura, setFechaApertura] = useState('');
  const [horario, setHorario] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [telefonos, setTelefonos] = useState('');
  const [spaActive, setSpaActive] = useState(false);
  const [tiendaActive, setTiendaActive] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // cargar datos de sucursal
        const res = await fetch(`${apiUrl}/Sucursal/${idSucursal}`);
        const s = await res.json();
        setDireccion(s.direccionSucursal);
        setFechaApertura(s.fechaApertura.slice(0,10)); // YYYY-MM-DD
        setHorario(s.horarioAtencion);

        // cargar administrador, capacidad, teléfonos desde un endpoint extendido:
        // si no existe, puedes almacenar esos campos en otra tabla o JSON
        // aquí suponemos que vienen de Sucursal
        setIdAdmin(s.idEmpleadoAdmin?.toString() ?? '');
        setCapacidad(s.capacidadMaxima?.toString() ?? '');
        setTelefonos(s.telefonos?.join(', ') ?? '');

        // spa & tienda
        const [spaRes, tiRes] = await Promise.all([
          fetch(`${apiUrl}/Spa?idsucursal=${idSucursal}`),
          fetch(`${apiUrl}/Tienda?idsucursal=${idSucursal}`)
        ]);
        const spaList = await spaRes.json();
        const tiList  = await tiRes.json();
        if (spaList.length) setSpaActive(spaList[0].estadoSpa === 1);
        if (tiList.length) setTiendaActive(tiList[0].estadoTienda === 1);

      } catch (err) {
        console.error(err);
        Alert.alert('Error','No se pudo cargar la sucursal.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      // actualizar Sucursal
      await fetch(`${apiUrl}/Sucursal/${idSucursal}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          idSucursal,
          direccionSucursal: direccion,
          fechaApertura: new Date(fechaApertura).toISOString(),
          horarioAtencion: horario,
          idEmpleadoAdmin: parseInt(idAdmin,10),
          capacidadMaxima: parseInt(capacidad,10),
          telefonos: telefonos.split(',').map(t=>t.trim())
        })
      });

      // actualizar SPA
      const spaRes = await fetch(`${apiUrl}/Spa?idsucursal=${idSucursal}`);
      const spaList = await spaRes.json();
      if (spaList.length) {
        const spa = spaList[0];
        await fetch(`${apiUrl}/Spa/${spa.idSpa}`, {
          method: 'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            idSpa: spa.idSpa,
            idSucursal,
            estadoSpa: spaActive ? 1 : 2
          })
        });
      }

      // actualizar Tienda
      const tiRes = await fetch(`${apiUrl}/Tienda?idsucursal=${idSucursal}`);
      const tiList = await tiRes.json();
      if (tiList.length) {
        const tienda = tiList[0];
        await fetch(`${apiUrl}/Tienda/${tienda.idTienda}`, {
          method: 'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            idTienda: tienda.idTienda,
            idSucursal,
            estadoTienda: tiendaActive ? 1 : 2
          })
        });
      }

      Alert.alert('Éxito','Sucursal actualizada.',[
        { text:'OK', onPress:() => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error','No se pudo guardar.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
      />

      <Text style={styles.label}>Fecha Apertura (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={fechaApertura}
        onChangeText={setFechaApertura}
      />

      <Text style={styles.label}>Horario Atención</Text>
      <TextInput
        style={styles.input}
        value={horario}
        onChangeText={setHorario}
      />

      <Text style={styles.label}>Empleado Admin (cédula)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={idAdmin}
        onChangeText={setIdAdmin}
      />

      <Text style={styles.label}>Capacidad Máxima</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={capacidad}
        onChangeText={setCapacidad}
      />

      <Text style={styles.label}>Teléfonos (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={telefonos}
        onChangeText={setTelefonos}
      />

      <View style={styles.row}>
        <Text>Activar SPA</Text>
        <Switch value={spaActive} onValueChange={setSpaActive}/>
      </View>

      <View style={styles.row}>
        <Text>Activar Tienda</Text>
        <Switch value={tiendaActive} onValueChange={setTiendaActive}/>
      </View>

      <Button title="Guardar" onPress={handleSave}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { padding:20, backgroundColor:'#fff' },
  label:     { marginTop:12, fontWeight:'600' },
  input:     {
               backgroundColor:'#eee',
               borderRadius:6,
               padding:8,
               marginTop:4
             },
  row:       {
               flexDirection:'row',
               justifyContent:'space-between',
               alignItems:'center',
               marginTop:16
             }
});
