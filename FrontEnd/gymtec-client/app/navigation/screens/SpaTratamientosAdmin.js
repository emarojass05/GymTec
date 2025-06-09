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
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function SpaTratamientosAdmin() {
  const [spaTratamientos, setSpaTratamientos] = useState([]);
  const [tratamientos, setTratamientos]       = useState([]);
  const [spas, setSpas]                       = useState([]);
  const [sucursales, setSucursales]           = useState([]);
  const [loading, setLoading]                 = useState(true);

  // modals
  const [modalRel, setModalRel] = useState(false);
  const [selSucursal, setSelSucursal]       = useState(null);
  const [selTratamiento, setSelTratamiento] = useState(null);

  const [modalNew, setModalNew]    = useState(false);
  const [newTratamientoName, setNewTratamientoName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [stRes, tRes, spaRes, sucRes] = await Promise.all([
          fetch(`${apiUrl}/SpaTratamiento`),
          fetch(`${apiUrl}/Tratamiento`),
          fetch(`${apiUrl}/Spa`),
          fetch(`${apiUrl}/Sucursal`)
        ]);
        const [stData, tData, spaData, sucData] = await Promise.all([
          stRes.json(), tRes.json(), spaRes.json(), sucRes.json()
        ]);
        setSpaTratamientos(stData);
        setTratamientos(tData);
        setSpas(spaData);
        setSucursales(sucData);
      } catch (err) {
        console.error(err);
        Alert.alert('Error','No fue posible cargar datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (item) => {
    // item: { idSpa, idTratamiento }
    try {
      const res = await fetch(
        `${apiUrl}/SpaTratamiento/${item.idSpa}/${item.idTratamiento}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error();
      setSpaTratamientos(st =>
        st.filter(x =>
          !(x.idSpa === item.idSpa && x.idTratamiento === item.idTratamiento)
        )
      );
    } catch {
      Alert.alert('Error','No se pudo eliminar.');
    }
  };

  const handleAddRelation = async () => {
    if (!selSucursal || !selTratamiento) {
      Alert.alert('Error','Seleccione sucursal y tratamiento.');
      return;
    }
    const spa = spas.find(s => s.idSucursal === selSucursal);
    if (!spa) {
      Alert.alert('Error','La sucursal no tiene SPA.');
      return;
    }
    const payload = { idSpa: spa.idSpa, idTratamiento: selTratamiento };
    try {
      const res = await fetch(`${apiUrl}/SpaTratamiento`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setSpaTratamientos(st => [...st, payload]);
      setModalRel(false);
      setSelSucursal(null);
      setSelTratamiento(null);
    } catch {
      Alert.alert('Error','No se pudo registrar.');
    }
  };

  const handleAddNew = async () => {
    if (!newTratamientoName.trim()) {
      Alert.alert('Error','Ingrese nombre.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/Tratamiento`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ nombreTratamiento: newTratamientoName })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTratamientos(t => [...t, created]);
      setNewTratamientoName('');
      setModalNew(false);
    } catch {
      Alert.alert('Error','No se pudo crear.');
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
    <View style={styles.container}>
      {/* Lista de asignaciones */}
      <FlatList
        data={spaTratamientos}
        keyExtractor={(item,idx)=>`${item.idSpa}-${item.idTratamiento}-${idx}`}
        renderItem={({ item }) => {
          const spa = spas.find(s=>s.idSpa===item.idSpa);
          const suc = sucursales.find(x=>x.idSucursal===spa?.idSucursal);
          const tr  = tratamientos.find(t=>t.idTratamiento===item.idTratamiento);
          return (
            <View style={styles.card}>
              <Text style={styles.text}>
                {suc?.direccionSucursal ?? '—'}: {tr?.nombreTratamiento ?? '—'}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No hay tratamientos.</Text>}
      />

      {/* Botón añadir relación */}
      <TouchableOpacity
        style={[styles.addButton, {right: 80}]}
        onPress={()=>setModalRel(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Botón añadir nuevo tratamiento */}
      <TouchableOpacity
        style={[styles.addButton, {right: 20}]}
        onPress={()=>setModalNew(true)}
      >
        <Text style={styles.addButtonText}>Aa</Text>
      </TouchableOpacity>

      {/* Modal Relación */}
      <Modal visible={modalRel} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Asociar Tratamiento</Text>
            <Text style={styles.modalLabel}>Sucursal:</Text>
            <ScrollView style={styles.modalList}>
              {sucursales.map(s=>(
                <TouchableOpacity
                  key={s.idSucursal}
                  onPress={()=>setSelSucursal(s.idSucursal)}
                >
                  <Text style={[
                    styles.option,
                    selSucursal===s.idSucursal && styles.selected
                  ]}>
                    {s.direccionSucursal}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.modalLabel}>Tratamiento:</Text>
            <ScrollView style={styles.modalList}>
              {tratamientos.map(t=>(
                <TouchableOpacity
                  key={t.idTratamiento}
                  onPress={()=>setSelTratamiento(t.idTratamiento)}
                >
                  <Text style={[
                    styles.option,
                    selTratamiento===t.idTratamiento && styles.selected
                  ]}>
                    {t.nombreTratamiento}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={()=>setModalRel(false)} />
              <Button title="Aceptar" onPress={handleAddRelation} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Nuevo Tratamiento */}
      <Modal visible={modalNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Tratamiento</Text>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={newTratamientoName}
              onChangeText={setNewTratamientoName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={()=>setModalNew(false)} />
              <Button title="Aceptar" onPress={handleAddNew} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { flex:1, backgroundColor:'#fff', padding:20 },
  card:      {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:16,
    marginBottom:12,
    backgroundColor:'#fafafa',
    borderRadius:6
  },
  text:      { fontSize:16, flex:1 },
  deleteButton:{
    paddingVertical:4,
    paddingHorizontal:8,
    backgroundColor:'#FF3B30',
    borderRadius:4
  },
  deleteText:{ color:'#fff' },

  addButton: {
    position:'absolute',
    bottom:24,
    width:56,
    height:56,
    borderRadius:28,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#007AFF',
    shadowColor:'#000',
    shadowOpacity:0.3,
    shadowOffset:{ width:0, height:2 },
    shadowRadius:4,
    elevation:5
  },
  addButtonText:{ color:'#fff', fontSize:24, fontWeight:'bold' },

  modalOverlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    padding:20
  },
  modalContent:{
    backgroundColor:'#fff',
    borderRadius:8,
    padding:16,
    maxHeight:'80%'
  },
  modalTitle:{ fontSize:18, fontWeight:'bold', marginBottom:12 },
  modalLabel:{ fontWeight:'600', marginTop:8 },
  modalList:{ maxHeight:100, marginVertical:8 },
  option:{ paddingVertical:6, paddingHorizontal:4 },
  selected:{ fontWeight:'bold', color:'#007AFF' },
  modalButtons:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20
  },
  input:{
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6,
    padding:8,
    marginTop:8
  },
  empty:{ textAlign:'center', marginTop:20 }
});
