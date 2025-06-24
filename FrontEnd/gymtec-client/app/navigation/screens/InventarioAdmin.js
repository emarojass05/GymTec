import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function InventarioAdmin() {
  // Datos
  const [maquinas, setMaquinas]     = useState([]);
  const [tipos, setTipos]           = useState([]);
  const [marcas, setMarcas]         = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Filtro de sucursal
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [dropdownVisible, setDropdownVisible]   = useState(false);

  // Editar existente
  const [modalEdit, setModalEdit]     = useState(false);
  const [selMachine, setSelMachine]   = useState(null);
  const [selSucursal, setSelSucursal] = useState(null);

  // Crear nueva
  const [modalNew, setModalNew]       = useState(false);
  const [newMachine, setNewMachine]   = useState({ idMarcaMaquina: null, idTipoEquipo: null });
  const [newSucursal, setNewSucursal] = useState(null);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const [mRes, tRes, maRes, sRes] = await Promise.all([
          fetch(`${apiUrl}/Maquina`),
          fetch(`${apiUrl}/TipoEquipo`),
          fetch(`${apiUrl}/MarcaMaquina`),
          fetch(`${apiUrl}/Sucursal`)
        ]);
        const [mData, tData, maData, sData] = await Promise.all([
          mRes.json(), tRes.json(), maRes.json(), sRes.json()
        ]);
        setMaquinas(mData);
        setTipos(tData);
        setMarcas(maData);
        setSucursales(sData);
      } catch {
        Alert.alert('Error', 'No se pudo cargar datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reasignar sucursal
  const handleSave = async () => {
    try {
      const payload = {
        idMaquina:      selMachine.idMaquina,
        idMarcaMaquina: selMachine.idMarcaMaquina,
        idTipoEquipo:   selMachine.idTipoEquipo,
        idSucursal:     selSucursal
      };
      const res = await fetch(`${apiUrl}/Maquina/${selMachine.idMaquina}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setMaquinas(list =>
        list.map(m =>
          m.idMaquina === selMachine.idMaquina
            ? { ...m, idSucursal: selSucursal }
            : m
        )
      );
      setModalEdit(false);
    } catch {
      Alert.alert('Error', 'No se pudo reasignar.');
    }
  };

  // Eliminar
  const handleDelete = async id => {
    try {
      const res = await fetch(`${apiUrl}/Maquina/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMaquinas(list => list.filter(m => m.idMaquina !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar máquina.');
    }
  };

  // Crear nueva máquina (usa POST Sucursal/{id})
  const handleCreate = async () => {
    if (!newMachine.idMarcaMaquina || !newMachine.idTipoEquipo || !newSucursal) {
      Alert.alert('Error', 'Complete marca, tipo y sucursal.');
      return;
    }
    try {
      const body = {
        idMarcaMaquina: newMachine.idMarcaMaquina,
        idTipoEquipo:   newMachine.idTipoEquipo
      };
      const res = await fetch(
        `${apiUrl}/Maquina/Sucursal/${newSucursal}`,
        {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(body)
        }
      );
      if (!res.ok) throw new Error();
      const created = await res.json();
      setMaquinas(list => [...list, created]);
      setModalNew(false);
      setNewMachine({ idMarcaMaquina: null, idTipoEquipo: null });
      setNewSucursal(null);
    } catch {
      Alert.alert('Error', 'No se pudo crear máquina.');
    }
  };

  // Mientras carga, spinner
  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  // Aplica filtro `selectedSucursal`
  const filtered = maquinas.filter(
    m => selectedSucursal === null || m.idSucursal === selectedSucursal
  );

  return (
    <View style={styles.container}>

      {/* ← FILTRO ↓↓↓ */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setDropdownVisible(v => !v)}
        >
          <Text style={styles.filterButtonText}>
            {selectedSucursal === null
              ? 'Todas / Sin asignar'
              : sucursales.find(s => s.idSucursal === selectedSucursal)
                  ?.direccionSucursal}
          </Text>
        </TouchableOpacity>
        {dropdownVisible && (
          <ScrollView style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                setSelectedSucursal(null);
                setDropdownVisible(false);
              }}
            >
              <Text
                style={[
                  styles.option,
                  selectedSucursal === null && styles.selected
                ]}
              >
                Todas / Sin asignar
              </Text>
            </TouchableOpacity>
            {sucursales.map(s => (
              <TouchableOpacity
                key={s.idSucursal}
                onPress={() => {
                  setSelectedSucursal(s.idSucursal);
                  setDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.option,
                    selectedSucursal === s.idSucursal && styles.selected
                  ]}
                >
                  {s.direccionSucursal}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      {/* ↑↑↑ FIN FILTRO */}

      {/* LISTA */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.idMaquina.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No hay máquinas.</Text>}
        renderItem={({ item }) => {
          const tipo  = tipos.find(x => x.idTipoEquipo === item.idTipoEquipo);
          const marca = marcas.find(x => x.idMarcaMaquina === item.idMarcaMaquina);
          const suc   = sucursales.find(x => x.idSucursal === item.idSucursal);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.label}>Serial: {item.idMaquina}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setSelMachine(item);
                      setSelSucursal(item.idSucursal);
                      setModalEdit(true);
                    }}
                  >
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.idMaquina)}
                  >
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.line}>
                <Text style={styles.subLabel}>Tipo:</Text> {tipo?.descripcionTipoEquipo}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.subLabel}>Marca:</Text> {marca?.nombreMarcaMaquina}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.subLabel}>Sucursal:</Text>{' '}
                {suc?.direccionSucursal ?? 'Sin asignar'}
              </Text>
            </View>
          );
        }}
      />

      {/* + Nueva Máquina */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal: Reasignar */}
      <Modal visible={modalEdit} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Reasignar Sucursal</Text>
          {sucursales.map(s => (
            <TouchableOpacity key={s.idSucursal} onPress={() => setSelSucursal(s.idSucursal)}>
              <Text style={[styles.option, selSucursal === s.idSucursal && styles.selected]}>
                {s.direccionSucursal}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalEdit(false)} />
            <Button title="Guardar"   onPress={handleSave} />
          </View>
        </ScrollView>
      </Modal>

      {/* Modal: Nueva Máquina */}
      <Modal visible={modalNew} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Nueva Máquina</Text>

          <Text style={styles.subLabel}>Marca</Text>
          {marcas.map(ma => (
            <TouchableOpacity
              key={ma.idMarcaMaquina}
              onPress={() =>
                setNewMachine(nm => ({ ...nm, idMarcaMaquina: ma.idMarcaMaquina }))
              }
            >
              <Text
                style={[
                  styles.option,
                  newMachine.idMarcaMaquina === ma.idMarcaMaquina && styles.selected
                ]}
              >
                {ma.nombreMarcaMaquina}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subLabel}>Tipo</Text>
          {tipos.map(t => (
            <TouchableOpacity
              key={t.idTipoEquipo}
              onPress={() =>
                setNewMachine(nm => ({ ...nm, idTipoEquipo: t.idTipoEquipo }))
              }
            >
              <Text
                style={[
                  styles.option,
                  newMachine.idTipoEquipo === t.idTipoEquipo && styles.selected
                ]}
              >
                {t.descripcionTipoEquipo}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subLabel}>Sucursal</Text>
          {sucursales.map(s => (
            <TouchableOpacity
              key={s.idSucursal}
              onPress={() => setNewSucursal(s.idSucursal)}
            >
              <Text
                style={[
                  styles.option,
                  newSucursal === s.idSucursal && styles.selected
                ]}
              >
                {s.direccionSucursal}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalNew(false)} />
            <Button title="Crear"     onPress={handleCreate} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:            { flex:1, justifyContent:'center', alignItems:'center' },
  container:         { flex:1, padding:20, backgroundColor:'#fff' },
  filterContainer:   { marginBottom:12 },
  filterButton:      { padding:12, backgroundColor:'#eee', borderRadius:6 },
  filterButtonText:  { fontSize:16 },
  dropdown:          { backgroundColor:'#fafafa', borderRadius:6, maxHeight:150, marginTop:4 },
  option:            { padding:12 },
  selected:          { color:'#007AFF', fontWeight:'bold' },
  card:              { padding:16, marginBottom:12, backgroundColor:'#fafafa', borderRadius:6, borderWidth:1, borderColor:'#ddd' },
  cardHeader:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  cardActions:       { flexDirection:'row' },
  label:             { fontWeight:'600' },
  subLabel:          { fontWeight:'600', marginTop:8 },
  line:              { marginBottom:6 },
  empty:             { textAlign:'center', marginTop:20, color:'#666' },
  editButton:        { backgroundColor:'#007AFF', padding:6, borderRadius:4, marginRight:8 },
  editText:          { color:'#fff' },
  deleteButton:      { backgroundColor:'#FF3B30', padding:6, borderRadius:4 },
  deleteText:        { color:'#fff' },
  addButton:         { position:'absolute', bottom:24, right:24, width:56, height:56, borderRadius:28, backgroundColor:'#007AFF', justifyContent:'center', alignItems:'center', elevation:5 },
  addButtonText:     { color:'#fff', fontSize:32 },
  modal:             { padding:20, backgroundColor:'#fff' },
  modalTitle:        { fontSize:18, fontWeight:'bold', marginBottom:12 },
  modalButtons:      { flexDirection:'row', justifyContent:'space-between', marginTop:20 }
});
