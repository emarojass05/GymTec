import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function PlanillasAdmin() {
  const [planillas, setPlanillas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading]     = useState(true);

  const [modalNew, setModalNew]   = useState(false);
  const [newDesc, setNewDesc]     = useState('');

  const [modalAssign, setModalAssign]     = useState(false);
  const [selectedPlanilla, setSelectedPlanilla] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, eRes] = await Promise.all([
        fetch(`${apiUrl}/Planilla`),
        fetch(`${apiUrl}/Empleado`)
      ]);
      const [pData, eData] = await Promise.all([pRes.json(), eRes.json()]);
      setPlanillas(pData);
      setEmpleados(eData);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo cargar datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`${apiUrl}/Planilla/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setPlanillas(pl => pl.filter(x => x.idPlanilla !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la planilla.');
    }
  };

  const handleAdd = async () => {
    const desc = newDesc.trim();
    if (!desc) {
      Alert.alert('Error', 'Ingrese descripción.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/Planilla`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcionPlanilla: desc })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setPlanillas(pl => [...pl, created]);
      setNewDesc('');
      setModalNew(false);
    } catch {
      Alert.alert('Error', 'No se pudo crear la planilla.');
    }
  };

  const openAssign = plan => {
    setSelectedPlanilla(plan);
    setModalAssign(true);
  };

  const assignEmpleado = async cedula => {
    try {
      const emp = empleados.find(e => e.cedulaEmpleado === cedula);
      const updated = { ...emp, idPlanilla: selectedPlanilla.idPlanilla };
      const res = await fetch(`${apiUrl}/Empleado/${cedula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      setEmpleados(es => es.map(e => e.cedulaEmpleado === cedula ? updated : e));
    } catch {
      Alert.alert('Error', 'No se pudo asignar empleado.');
    }
  };

  const removeEmpleado = async cedula => {
    try {
      const emp = empleados.find(e => e.cedulaEmpleado === cedula);
      const updated = { ...emp, idPlanilla: 1 };
      const res = await fetch(`${apiUrl}/Empleado/${cedula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      setEmpleados(es => es.map(e => e.cedulaEmpleado === cedula ? updated : e));
    } catch {
      Alert.alert('Error', 'No se pudo remover empleado.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large"/>;
  }

  const assigned = empleados.filter(e => e.idPlanilla === selectedPlanilla?.idPlanilla);
  const unassigned = empleados.filter(e => e.idPlanilla !== selectedPlanilla?.idPlanilla);

  return (
    <View style={styles.container}>
      <FlatList
        data={planillas}
        keyExtractor={item => item.idPlanilla.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.descripcionPlanilla}</Text>
            {item.idPlanilla > 4 ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.idPlanilla)}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lockedText}>Fijo</Text>
            )}
            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => openAssign(item)}
            >
              <Text style={styles.assignText}>Asignar/Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay planillas.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal Nueva Planilla */}
      <Modal visible={modalNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Planilla</Text>
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={newDesc}
              onChangeText={setNewDesc}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalNew(false)} />
              <Button title="Crear" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Asignar/Remover */}
      <Modal visible={modalAssign} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Planilla: {selectedPlanilla?.descripcionPlanilla}
          </Text>
          <Text style={styles.subTitle}>Asignados:</Text>
          <FlatList
            data={assigned}
            keyExtractor={e => e.cedulaEmpleado.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text>{item.nombreEmpleado}</Text>
                <Button
                  title="Remover"
                  onPress={() => removeEmpleado(item.cedulaEmpleado)}
                />
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Sin empleados.</Text>}
          />
          <Text style={styles.subTitle}>Disponibles:</Text>
          <FlatList
            data={unassigned}
            keyExtractor={e => e.cedulaEmpleado.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text>{item.nombreEmpleado}</Text>
                <Button
                  title="Asignar"
                  onPress={() => assignEmpleado(item.cedulaEmpleado)}
                />
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No hay empleados.</Text>}
          />
          <Button title="Cerrar" onPress={() => setModalAssign(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:      { flex:1, justifyContent:'center', alignItems:'center' },
  container:   { flex:1, backgroundColor:'#fff', padding:20 },
  card:        {
                 padding:16,
                 marginBottom:12,
                 backgroundColor:'#fafafa',
                 borderRadius:6,
                 flexDirection:'row',
                 alignItems:'center'
               },
  text:        { flex:1, fontSize:16 },
  deleteButton:{
                 backgroundColor:'#FF3B30',
                 paddingHorizontal:8,
                 paddingVertical:4,
                 borderRadius:4,
                 marginRight:8
               },
  deleteText:  { color:'#fff' },
  lockedText:  { color:'#999', fontStyle:'italic', marginRight:8 },
  assignButton:{
                 backgroundColor:'#007AFF',
                 paddingHorizontal:8,
                 paddingVertical:4,
                 borderRadius:4
               },
  assignText:  { color:'#fff' },
  empty:       { textAlign:'center', marginTop:20 },

  addButton:   {
                 position:'absolute',
                 bottom:24,
                 right:24,
                 width:56,
                 height:56,
                 borderRadius:28,
                 backgroundColor:'#007AFF',
                 justifyContent:'center',
                 alignItems:'center',
                 shadowColor:'#000',
                 shadowOpacity:0.3,
                 shadowOffset:{ width:0, height:2 },
                 shadowRadius:4,
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
  modalTitle:  { fontSize:18, fontWeight:'bold', marginBottom:12 },
  input:       {
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
  subTitle:    { fontSize:16, fontWeight:'600', marginTop:16 },
  row:         {
                 flexDirection:'row',
                 justifyContent:'space-between',
                 alignItems:'center',
                 paddingVertical:8
               }
});
