import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function ClasesInstructor() {
  const [clases, setClases] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cedulaInstructor, setCedulaInstructor] = useState(null);

  // Estado para “nueva clase”
  const [modalNew, setModalNew] = useState(false);
  const [newClase, setNewClase] = useState({
    tipo: null,
    grupal: false,
    capacidad: '',
    fecha: '',
    inicio: '',
    fin: '',
    sucursal: null
  });

  // Estado para “editar clase”
  const [modalEdit, setModalEdit] = useState(false);
  const [editClase, setEditClase] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cedIns = await AsyncStorage.getItem('cedulaEmpleado');
        if (!cedIns) {
          Alert.alert('Error', 'No se encontró sesión de instructor.');
          setLoading(false);
          return;
        }
        setCedulaInstructor(Number(cedIns));
        // Fetch data
        const [cRes, sRes, suRes] = await Promise.all([
          fetch(`${apiUrl}/Clase`),
          fetch(`${apiUrl}/Servicio`),
          fetch(`${apiUrl}/Sucursal`)
        ]);
        const [cData, sData, suData] = await Promise.all([
          cRes.json(), sRes.json(), suRes.json()
        ]);
        // Solo clases de este instructor
        const propias = cData.filter(c => c.idInstructorClase === Number(cedIns));
        setClases(propias);
        setServicios(sData);
        setSucursales(suData);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => {
    if (!cedulaInstructor) return;
    const res = await fetch(`${apiUrl}/Clase`);
    const data = await res.json();
    setClases(data.filter(c => c.idInstructorClase === cedulaInstructor));
  };

  const handleCreate = async () => {
    const { tipo, grupal, capacidad, fecha, inicio, fin, sucursal } = newClase;
    if (
      tipo == null || !capacidad || !fecha || !inicio || !fin || sucursal == null
    ) {
      Alert.alert('Error', 'Complete todos los campos.');
      return;
    }
    try {
      const payload = {
        tipoClase: tipo,
        idInstructorClase: cedulaInstructor,
        grupal,
        capacidadClase: parseInt(capacidad, 10),
        fechaClase: fecha,
        horaInicioClase: inicio,
        horaFinalizacionClase: fin,
        idSucursal: sucursal
      };
      const res = await fetch(`${apiUrl}/Clase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      await refresh();
      setModalNew(false);
      setNewClase({
        tipo: null,
        grupal: false,
        capacidad: '',
        fecha: '',
        inicio: '',
        fin: '',
        sucursal: null
      });
    } catch {
      Alert.alert('Error', 'No se pudo crear la clase.');
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`${apiUrl}/Clase/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setClases(prev => prev.filter(c => c.idClase !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la clase.');
    }
  };

  const openEdit = clase => {
    setEditClase({
      ...clase,
      tipoClase: clase.tipoClase ?? clase.tipo, // para compatibilidad con ambos props
      grupal: clase.grupal,
      capacidad: clase.capacidadClase ? clase.capacidadClase.toString() : '',
      fecha: clase.fechaClase ? clase.fechaClase.split('T')[0] : '',
      inicio: clase.horaInicioClase ? clase.horaInicioClase.slice(0, 5) : '',
      fin: clase.horaFinalizacionClase ? clase.horaFinalizacionClase.slice(0, 5) : ''
    });
    setModalEdit(true);
  };

  const handleUpdate = async () => {
    if (!editClase) return;
    const {
      idClase, tipoClase,
      grupal, capacidad, fecha, inicio, fin, idSucursal
    } = editClase;
    if (
      tipoClase == null ||
      !capacidad || !fecha || !inicio || !fin || idSucursal == null
    ) {
      Alert.alert('Error', 'Complete todos los campos.');
      return;
    }
    try {
      const payload = {
        tipoClase,
        idInstructorClase: cedulaInstructor,
        grupal,
        capacidadClase: parseInt(capacidad, 10),
        fechaClase: fecha,
        horaInicioClase: inicio,
        horaFinalizacionClase: fin,
        idSucursal
      };
      const res = await fetch(`${apiUrl}/Clase/${idClase}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      await refresh();
      setModalEdit(false);
      setEditClase(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la clase.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clases}
        keyExtractor={item => item.idClase.toString()}
        renderItem={({ item }) => {
          const srv = servicios.find(s => s.idServicio === (item.tipoClase ?? item.tipo));
          const suc = sucursales.find(s => s.idSucursal === item.idSucursal);
          return (
            <View style={styles.card}>
              <Text style={styles.line}><Text style={styles.label}>Tipo:</Text> {srv?.descripcionServicio}</Text>
              <Text style={styles.line}><Text style={styles.label}>Grupal:</Text> {item.grupal ? 'Sí' : 'No'}</Text>
              <Text style={styles.line}><Text style={styles.label}>Cupos:</Text> {item.capacidadClase}</Text>
              <Text style={styles.line}><Text style={styles.label}>Fecha:</Text> {new Date(item.fechaClase).toLocaleDateString()}</Text>
              <Text style={styles.line}><Text style={styles.label}>Hora:</Text> {item.horaInicioClase.slice(0,5)} - {item.horaFinalizacionClase.slice(0,5)}</Text>
              <Text style={styles.line}><Text style={styles.label}>Sucursal:</Text> {suc?.direccionSucursal}</Text>
              <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.idClase)}>
                  <Text style={styles.btnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No tienes clases asignadas.</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalNew(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal para crear */}
      <Modal visible={modalNew} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.modalTitle}>Nueva Clase</Text>

          <Text style={styles.subLabel}>Tipo de Clase</Text>
          {servicios.map(s => (
            <TouchableOpacity
              key={s.idServicio}
              onPress={() => setNewClase(n => ({ ...n, tipo: s.idServicio }))}
            >
              <Text style={[
                styles.option,
                newClase.tipo === s.idServicio && styles.selected
              ]}>
                {s.descripcionServicio}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.row}>
            <Text style={styles.subLabel}>Grupal</Text>
            <Switch
              value={newClase.grupal}
              onValueChange={val => setNewClase(n => ({ ...n, grupal: val }))}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Cupos"
            keyboardType="numeric"
            value={newClase.capacidad}
            onChangeText={t => setNewClase(n => ({ ...n, capacidad: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha (YYYY-MM-DD)"
            value={newClase.fecha}
            onChangeText={t => setNewClase(n => ({ ...n, fecha: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora inicio (HH:MM)"
            value={newClase.inicio}
            onChangeText={t => setNewClase(n => ({ ...n, inicio: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora fin (HH:MM)"
            value={newClase.fin}
            onChangeText={t => setNewClase(n => ({ ...n, fin: t }))}
          />

          <Text style={styles.subLabel}>Sucursal</Text>
          {sucursales.map(s => (
            <TouchableOpacity
              key={s.idSucursal}
              onPress={() => setNewClase(n => ({ ...n, sucursal: s.idSucursal }))}
            >
              <Text style={[
                styles.option,
                newClase.sucursal === s.idSucursal && styles.selected
              ]}>
                {s.direccionSucursal}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalNew(false)} />
            <Button title="Crear" onPress={handleCreate} />
          </View>
        </ScrollView>
      </Modal>

      {/* Modal para editar */}
      <Modal visible={modalEdit} animationType="slide">
        {editClase && (
          <ScrollView style={styles.modal}>
            <Text style={styles.modalTitle}>Editar Clase</Text>

            <Text style={styles.subLabel}>Tipo de Clase</Text>
            {servicios.map(s => (
              <TouchableOpacity
                key={s.idServicio}
                onPress={() => setEditClase(eOld => ({ ...eOld, tipoClase: s.idServicio }))}
              >
                <Text style={[
                  styles.option,
                  editClase.tipoClase === s.idServicio && styles.selected
                ]}>
                  {s.descripcionServicio}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.row}>
              <Text style={styles.subLabel}>Grupal</Text>
              <Switch
                value={editClase.grupal}
                onValueChange={val => setEditClase(eOld => ({ ...eOld, grupal: val }))}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Cupos"
              keyboardType="numeric"
              value={editClase.capacidad}
              onChangeText={t => setEditClase(eOld => ({ ...eOld, capacidad: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={editClase.fecha}
              onChangeText={t => setEditClase(eOld => ({ ...eOld, fecha: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Hora inicio (HH:MM)"
              value={editClase.inicio}
              onChangeText={t => setEditClase(eOld => ({ ...eOld, inicio: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Hora fin (HH:MM)"
              value={editClase.fin}
              onChangeText={t => setEditClase(eOld => ({ ...eOld, fin: t }))}
            />

            <Text style={styles.subLabel}>Sucursal</Text>
            {sucursales.map(s => (
              <TouchableOpacity
                key={s.idSucursal}
                onPress={() => setEditClase(eOld => ({ ...eOld, idSucursal: s.idSucursal }))}
              >
                <Text style={[
                  styles.option,
                  editClase.idSucursal === s.idSucursal && styles.selected
                ]}>
                  {s.direccionSucursal}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => { setModalEdit(false); setEditClase(null); }} />
              <Button title="Guardar" onPress={handleUpdate} />
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:       { flex:1, justifyContent:'center', alignItems:'center' },
  container:    { flex:1, backgroundColor:'#fff' },
  card:         {
                  padding:16,
                  margin:12,
                  backgroundColor:'#fafafa',
                  borderRadius:6,
                  borderWidth:1,
                  borderColor:'#ddd'
                },
  line:         { marginBottom:6 },
  label:        { fontWeight:'600' },
  buttonsRow:   { flexDirection:'row', justifyContent:'flex-end', marginTop:8 },
  btnSmall:     {
                  backgroundColor:'#007AFF',
                  paddingVertical:4,
                  paddingHorizontal:8,
                  borderRadius:4,
                  marginRight:8
                },
  btnDelete:    {
                  backgroundColor:'#FF3B30',
                  paddingVertical:4,
                  paddingHorizontal:8,
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

  modal:        { flex:1, backgroundColor:'#fff', padding:20 },
  modalTitle:   { fontSize:18, fontWeight:'bold', marginBottom:12 },
  subLabel:     { marginTop:12, fontWeight:'600' },
  option:       { padding:8 },
  selected:     { color:'#007AFF', fontWeight:'bold' },
  row:          { flexDirection:'row', alignItems:'center', marginTop:12 },
  input:        {
                  borderWidth:1,
                  borderColor:'#ccc',
                  borderRadius:6,
                  padding:8,
                  marginTop:8
                },
  modalButtons: {
                  flexDirection:'row',
                  justifyContent:'space-between',
                  marginTop:20
                }
});
