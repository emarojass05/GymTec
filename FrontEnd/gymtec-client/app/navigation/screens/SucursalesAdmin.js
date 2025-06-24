import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function SucursalesAdmin({ navigation }) {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading]       = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [direccionNuevo, setDireccionNuevo] = useState('');
  const [fechaAperturaNuevo, setFechaAperturaNuevo] = useState('');
  const [horarioNuevo, setHorarioNuevo] = useState('');

  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => { fetchSucursales(); }, []);

  const showMessage = (text) => {
    setMessageText(text);
    setMessageModalVisible(true);
  };

  const fetchSucursales = () => {
    setLoading(true);
    fetch(`${apiUrl}/Sucursal`)
      .then(res => res.json())
      .then(setSucursales)
      .catch(() => showMessage('No se pudo cargar sucursales.'))
      .finally(() => setLoading(false));
  };

  const handleCreate = async () => {
    if (!direccionNuevo || !fechaAperturaNuevo || !horarioNuevo) {
      showMessage('Complete todos los campos.');
      return;
    }
    try {
      const resSucursal = await fetch(`${apiUrl}/Sucursal`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          direccionSucursal: direccionNuevo,
          fechaApertura: new Date(fechaAperturaNuevo).toISOString(),
          horarioAtencion: horarioNuevo
        })
      });
      if (!resSucursal.ok) throw new Error();
      const created = await resSucursal.json();
      const id = created.idSucursal;

      await fetch(`${apiUrl}/Spa`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ idSucursal: id, estadoSpa: 2 })
      });
      await fetch(`${apiUrl}/Tienda`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ idSucursal: id, estadoTienda: 2 })
      });

      setModalVisible(false);
      setDireccionNuevo(''); setFechaAperturaNuevo(''); setHorarioNuevo('');
      fetchSucursales();
      showMessage('Sucursal creada con SPA y Tienda inactivos.');
    } catch {
      showMessage('No se pudo crear la sucursal.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/Sucursal/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      fetchSucursales();
      showMessage('Sucursal eliminada correctamente.');
    } catch {
      showMessage('No se pudo eliminar la sucursal.');
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large"/></View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Crear Sucursal</Text>
      </TouchableOpacity>

      <FlatList
        data={sucursales}
        keyExtractor={item => item.idSucursal.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay sucursales.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('SucursalDetailAdmin', { idSucursal: item.idSucursal })}
            >
              <Text style={styles.text}>{item.direccionSucursal}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.idSucursal)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput style={styles.input} value={direccionNuevo} onChangeText={setDireccionNuevo} />

            <Text style={styles.label}>Fecha Apertura (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={fechaAperturaNuevo} onChangeText={setFechaAperturaNuevo} />

            <Text style={styles.label}>Horario Atención</Text>
            <TextInput style={styles.input} value={horarioNuevo} onChangeText={setHorarioNuevo} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={messageModalVisible} transparent animationType="fade" onRequestClose={() => setMessageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{messageText}</Text>
            <TouchableOpacity style={styles.button} onPress={() => setMessageModalVisible(false)}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  list:      { paddingTop:10 },
  itemRow:   { flexDirection:'row', alignItems:'center', marginBottom:10 },
  item:      { flex:1, padding:16, backgroundColor:'#fafafa', borderRadius:6 },
  text:      { fontSize:16 },
  deleteButton: { marginLeft:10, padding:8, backgroundColor:'#ff6666', borderRadius:6 },
  deleteText:{ color:'#fff' },
  empty:     { textAlign:'center', marginTop:20 },
  button:    { padding:12, backgroundColor:'#0066cc', borderRadius:6, alignItems:'center' },
  buttonText:{ color:'#fff', fontWeight:'600' },
  modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  modalContent:{ width:'90%', backgroundColor:'#fff', borderRadius:8, padding:20 },
  messageContent:{ width:'80%', backgroundColor:'#fff', borderRadius:8, padding:20, alignItems:'center' },
  messageText:{ marginBottom:20, textAlign:'center' },
  label:     { marginTop:12, fontWeight:'600' },
  input:     { backgroundColor:'#eee', borderRadius:6, padding:8, marginTop:4 },
  modalButtons:{ flexDirection:'row', justifyContent:'space-between', marginTop:20 }
});
