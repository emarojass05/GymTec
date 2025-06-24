import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apiUrl } from '../../../utils';

export default function SucursalDetailAdmin({ route, navigation }) {
  const { idSucursal } = route.params;

  const [loading, setLoading] = useState(true);
  const [direccion, setDireccion] = useState('');
  const [fechaApertura, setFechaApertura] = useState('');
  const [horario, setHorario] = useState('');
  const [spaActive, setSpaActive] = useState(false);
  const [tiendaActive, setTiendaActive] = useState(false);

  // Telefonos
  const [telefonos, setTelefonos] = useState([]);
  const [selectedTelefono, setSelectedTelefono] = useState();
  const [newTelefono, setNewTelefono] = useState('');

  const fetchData = async () => {
    try {
      // Cargar datos de sucursal
      const res = await fetch(`${apiUrl}/Sucursal/${idSucursal}`);
      if (!res.ok) throw new Error();
      const s = await res.json();
      setDireccion(s.direccionSucursal);
      setFechaApertura(s.fechaApertura.slice(0, 10));
      setHorario(s.horarioAtencion);

      // SPA y Tienda
      const [spaRes, tiRes] = await Promise.all([
        fetch(`${apiUrl}/Spa?idsucursal=${idSucursal}`),
        fetch(`${apiUrl}/Tienda?idsucursal=${idSucursal}`)
      ]);
      const spaList = await spaRes.json();
      const tiList  = await tiRes.json();
      if (spaList.length) setSpaActive(spaList[0].estadoSpa === 1);
      if (tiList.length) setTiendaActive(tiList[0].estadoTienda === 1);

      // Telefonos
      const telRes = await fetch(`${apiUrl}/TelefonoSucursal/${idSucursal}`);
      if (telRes.ok) {
        const telList = await telRes.json();
        setTelefonos(telList.map(t => t.telefono.toString()));
        if (telList.length) setSelectedTelefono(telList[0].telefono.toString());
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo cargar los datos.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!direccion || !fechaApertura || !horario) {
      Alert.alert('Error', 'Complete todos los campos.');
      return;
    }
    try {
      // Actualizar Sucursal
      const res = await fetch(`${apiUrl}/Sucursal/${idSucursal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idSucursal,
          direccionSucursal: direccion,
          fechaApertura: new Date(fechaApertura).toISOString(),
          horarioAtencion: horario
        })
      });
      if (!res.ok) throw new Error();

      // SPA
      const spaRes = await fetch(`${apiUrl}/Spa?idsucursal=${idSucursal}`);
      const spaList = await spaRes.json();
      if (spaList.length) {
        const spa = spaList[0];
        await fetch(`${apiUrl}/Spa/${spa.idSpa}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idSpa: spa.idSpa, idSucursal, estadoSpa: spaActive ? 1 : 2 })
        });
      }

      // Tienda
      const tiRes = await fetch(`${apiUrl}/Tienda?idsucursal=${idSucursal}`);
      const tiList = await tiRes.json();
      if (tiList.length) {
        const tienda = tiList[0];
        await fetch(`${apiUrl}/Tienda/${tienda.idTienda}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idTienda: tienda.idTienda, idSucursal, estadoTienda: tiendaActive ? 1 : 2 })
        });
      }

      Alert.alert('Éxito', 'Sucursal actualizada.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la sucursal.');
    }
  };

  const handleAddTelefono = async () => {
    if (!newTelefono) { Alert.alert('Error', 'Ingrese un teléfono.'); return; }
    try {
      const res = await fetch(`${apiUrl}/TelefonoSucursal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: parseInt(newTelefono, 10), idSucursal })
      });
      if (!res.ok) throw new Error();
      setNewTelefono('');
      fetchData();
      Alert.alert('Éxito', 'Teléfono agregado.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo agregar teléfono.');
    }
  };

  const handleDeleteTelefono = async () => {
    if (!selectedTelefono) { Alert.alert('Error', 'Seleccione un teléfono.'); return; }
    try {
      const res = await fetch(`${apiUrl}/TelefonoSucursal/${selectedTelefono}/${idSucursal}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      fetchData();
      Alert.alert('Éxito', 'Teléfono eliminado.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo eliminar teléfono.');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Dirección</Text>
      <TextInput style={styles.input} value={direccion} onChangeText={setDireccion} />

      <Text style={styles.label}>Fecha Apertura (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={fechaApertura} onChangeText={setFechaApertura} />

      <Text style={styles.label}>Horario Atención</Text>
      <TextInput style={styles.input} value={horario} onChangeText={setHorario} />

      <View style={styles.row}>
        <Text>Activar SPA</Text>
        <Switch value={spaActive} onValueChange={setSpaActive} />
      </View>

      <View style={styles.row}>
        <Text>Activar Tienda</Text>
        <Switch value={tiendaActive} onValueChange={setTiendaActive} />
      </View>

      <Text style={styles.label}>Teléfonos</Text>
      <Picker
        selectedValue={selectedTelefono}
        onValueChange={value => setSelectedTelefono(value)}
      >
        {telefonos.map(tel => (
          <Picker.Item key={tel} label={tel} value={tel} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Nuevo teléfono"
        keyboardType="numeric"
        value={newTelefono}
        onChangeText={setNewTelefono}
      />
      <View style={styles.modalButtons}>
        <Button title="Añadir" onPress={handleAddTelefono} />
        <Button title="Eliminar" onPress={handleDeleteTelefono} />
      </View>

      <Button title="Guardar Cambios" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { padding:20, backgroundColor:'#fff' },
  label:     { marginTop:12, fontWeight:'600' },
  input:     { backgroundColor:'#eee', borderRadius:6, padding:8, marginTop:4 },
  row:       { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:16 },
  modalButtons: { flexDirection:'row', justifyContent:'space-between', marginTop:10 }
});
