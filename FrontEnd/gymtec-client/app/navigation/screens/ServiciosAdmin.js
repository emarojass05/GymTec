import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function ServiciosAdmin() {
  const [servicios, setServicios]       = useState([]);
  const [sucursales, setSucursales]     = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading]           = useState(true);

  const [modalNew, setModalNew]           = useState(false);
  const [newDesc, setNewDesc]             = useState('');

  const [modalAssign, setModalAssign]     = useState(false);
  const [currentServicio, setCurrentServicio] = useState(null);
  const [selSucursales, setSelSucursales] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) Servicios
        const sRes = await fetch(`${apiUrl}/Servicio`);
        const sText = sRes.ok ? await sRes.text() : '';
        const sData = sText ? JSON.parse(sText) : [];

        // 2) Sucursales
        const suRes = await fetch(`${apiUrl}/Sucursal`);
        const suText = suRes.ok ? await suRes.text() : '';
        const suData = suText ? JSON.parse(suText) : [];

        // 3) Asignaciones actuales
        const aRes = await fetch(`${apiUrl}/ServicioSucursal`);
        const aText = aRes.ok ? await aRes.text() : '';
        const aData = aText ? JSON.parse(aText) : [];

        setServicios(sData);
        setSucursales(suData);
        setAsignaciones(aData);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar datos de servicios.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshAsignaciones = async () => {
    try {
      const res = await fetch(`${apiUrl}/ServicioSucursal`);
      const text = res.ok ? await res.text() : '';
      setAsignaciones(text ? JSON.parse(text) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteServicio = async idServicio => {
    try {
      const res = await fetch(`${apiUrl}/Servicio/${idServicio}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setServicios(prev => prev.filter(s => s.idServicio !== idServicio));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el servicio.');
    }
  };

  const handleAddServicio = async () => {
    const desc = newDesc.trim();
    if (!desc) {
      Alert.alert('Error', 'Ingrese descripción.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/Servicio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ descripcionServicio: desc })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setServicios(prev => [...prev, created]);
      setNewDesc('');
      setModalNew(false);
    } catch {
      Alert.alert('Error', 'No se pudo crear el servicio.');
    }
  };

  const openAssignModal = servicio => {
    setCurrentServicio(servicio);
    const assignedIds = asignaciones
      .filter(a => a.idServicio === servicio.idServicio)
      .map(a => a.idSucursal);
    setSelSucursales(assignedIds);
    setModalAssign(true);
  };

  const toggleSucursal = idSucursal => {
    setSelSucursales(prev =>
      prev.includes(idSucursal)
        ? prev.filter(x => x !== idSucursal)
        : [...prev, idSucursal]
    );
  };

  const handleSaveAssign = async () => {
    try {
      // 1) Borra todas las viejas
      const toRemove = asignaciones.filter(a => a.idServicio === currentServicio.idServicio);
      await Promise.all(
        toRemove.map(a =>
          fetch(`${apiUrl}/ServicioSucursal/${a.idServicio}/${a.idSucursal}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
          })
        )
      );
      // 2) Inserta las nuevas
      await Promise.all(
        selSucursales.map(idSucursal =>
          fetch(`${apiUrl}/ServicioSucursal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              idServicio: currentServicio.idServicio,
              idSucursal
            })
          })
        )
      );
      // 3) Refresca localmente
      await refreshAsignaciones();
      setModalAssign(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar las asignaciones.');
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
    <View style={styles.container}>
      <FlatList
        data={servicios}
        keyExtractor={item => item.idServicio.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.descripcionServicio}</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.btnSmall}
                onPress={() => openAssignModal(item)}
              >
                <Text style={styles.btnText}>Asignar/Remover</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDeleteServicio(item.idServicio)}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay servicios.</Text>
        }
      />

      {/* botón para crear nuevo servicio */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal: Nueva descripción */}
      <Modal visible={modalNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Servicio</Text>
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={newDesc}
              onChangeText={setNewDesc}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalNew(false)} />
              <Button title="Crear" onPress={handleAddServicio} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Asignar / Remover sucursales */}
      <Modal visible={modalAssign} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Servicio: {currentServicio?.descripcionServicio}
          </Text>
          <Text style={styles.subTitle}>Sucursales:</Text>
          {sucursales.map(s => (
            <TouchableOpacity
              key={s.idSucursal}
              onPress={() => toggleSucursal(s.idSucursal)}
            >
              <Text
                style={[
                  styles.option,
                  selSucursales.includes(s.idSucursal) && styles.selected
                ]}
              >
                {s.direccionSucursal}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalAssign(false)} />
            <Button title="Guardar" onPress={handleSaveAssign} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:       { flex:1, justifyContent:'center', alignItems:'center' },
  container:    { flex:1, backgroundColor:'#fff', padding:20 },
  card:         {
                  padding:16,
                  marginBottom:12,
                  backgroundColor:'#fafafa',
                  borderRadius:6
                },
  text:         { fontSize:16, flex:1 },
  buttonsRow:   { flexDirection:'row', justifyContent:'flex-end' },
  btnSmall:     {
                  backgroundColor:'#007AFF',
                  paddingHorizontal:8,
                  paddingVertical:4,
                  borderRadius:4,
                  marginRight:8
                },
  btnDelete:    {
                  backgroundColor:'#FF3B30',
                  paddingHorizontal:8,
                  paddingVertical:4,
                  borderRadius:4
                },
  btnText:      { color:'#fff', fontWeight:'bold' },
  empty:        { textAlign:'center', marginTop:20 },

  addButton:    {
                  position:'absolute',
                  bottom:24,
                  right:24,
                  width:56,
                  height:56,
                  borderRadius:28,
                  backgroundColor:'#28A745',
                  justifyContent:'center',
                  alignItems:'center',
                  elevation:5
                },
  addButtonText:{ color:'#fff', fontSize:32 },

  modalOverlay:{ 
                  flex:1,
                  backgroundColor:'rgba(0,0,0,0.5)',
                  justifyContent:'center',
                  padding:20 
               },
  modalContent:{
                  backgroundColor:'#fff',
                  borderRadius:8,
                  padding:16
               },
  modalTitle:   { fontSize:18, fontWeight:'bold', marginBottom:12 },
  input:        {
                  borderWidth:1,
                  borderColor:'#ccc',
                  borderRadius:6,
                  padding:8,
                  marginBottom:12
               },
  modalButtons:{
                  flexDirection:'row',
                  justifyContent:'space-between'
               },
  modalContainer:{
                  flex:1,
                  padding:20,
                  backgroundColor:'#fff'
               },
  subTitle:     { fontSize:16, fontWeight:'600', marginBottom:8 },
  option:       { padding:8 },
  selected:     { color:'#007AFF', fontWeight:'bold' },
});
