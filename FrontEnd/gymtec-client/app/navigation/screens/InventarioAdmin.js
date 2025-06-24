import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [newMachine, setNewMachine]   = useState({ idMaquina: '', idMarcaMaquina: null, idTipoEquipo: null });
  const [newSucursal, setNewSucursal] = useState(null);

  // Gestión de marcas
  const [modalMarca, setModalMarca]           = useState(false);
  const [modalMarcaNew, setModalMarcaNew]     = useState(false);
  const [modalMarcaEdit, setModalMarcaEdit]   = useState(false);
  const [newMarcaName, setNewMarcaName]       = useState('');
  const [editMarca, setEditMarca]             = useState(null);

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

  // Refrescar marcas
  const refreshMarcas = async () => {
    try {
      const res = await fetch(`${apiUrl}/MarcaMaquina`);
      const data = await res.json();
      setMarcas(data);
    } catch {
      console.warn('No se pudo refrescar marcas');
    }
  };

  // Actualizar máquina existente
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
            ? { ...m,
                idMarcaMaquina: selMachine.idMarcaMaquina,
                idTipoEquipo:   selMachine.idTipoEquipo,
                idSucursal:     selSucursal }
            : m
        )
      );
      setModalEdit(false);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar máquina.');
    }
  };

  // Eliminar máquina
  const handleDelete = async id => {
    try {
      const res = await fetch(`${apiUrl}/Maquina/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMaquinas(list => list.filter(m => m.idMaquina !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar máquina.');
    }
  };

  // Crear nueva máquina
  const handleCreate = async () => {
    if (!newMachine.idMaquina.trim() || !newMachine.idMarcaMaquina || !newMachine.idTipoEquipo) {
      Alert.alert('Error', 'Complete serial, marca y tipo.');
      return;
    }
    try {
      const body = {
        idMaquina:      parseInt(newMachine.idMaquina, 10),
        idMarcaMaquina: newMachine.idMarcaMaquina,
        idTipoEquipo:   newMachine.idTipoEquipo,
        idSucursal:     newSucursal // puede ser null
      };
      const res = await fetch(
        `${apiUrl}/Maquina`,
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
      setNewMachine({ idMaquina: '', idMarcaMaquina: null, idTipoEquipo: null });
      setNewSucursal(null);
    } catch {
      Alert.alert('Error', 'No se pudo crear máquina.');
    }
  };

  // Crear marca
  const handleMarcaCreate = async () => {
    if (!newMarcaName.trim()) {
      Alert.alert('Error', 'Ingrese nombre de marca.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/MarcaMaquina`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ nombreMarcaMaquina: newMarcaName.trim() })
      });
      if (!res.ok) throw new Error();
      await refreshMarcas();
      setModalMarcaNew(false);
      setNewMarcaName('');
    } catch {
      Alert.alert('Error', 'No se pudo crear marca.');
    }
  };

  // Editar marca
  const handleMarcaUpdate = async () => {
    if (!editMarca.nombreMarcaMaquina.trim()) {
      Alert.alert('Error', 'Nombre no puede quedar vacío.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/MarcaMaquina/${editMarca.idMarcaMaquina}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(editMarca)
      });
      if (!res.ok) throw new Error();
      await refreshMarcas();
      setModalMarcaEdit(false);
      setEditMarca(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar marca.');
    }
  };

  // Eliminar marca
  const handleMarcaDelete = async id => {
    try {
      const res = await fetch(`${apiUrl}/MarcaMaquina/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMarcas(list => list.filter(m => m.idMarcaMaquina !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar marca.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  // Filtrar máquinas
  const filtered = maquinas.filter(
    m => selectedSucursal === null || m.idSucursal === selectedSucursal
  );

  return (
    <View style={styles.container}>

      {/* FILTRO */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setDropdownVisible(v => !v)}
        >
          <Text style={styles.filterButtonText}>
            {selectedSucursal === null
              ? 'Todas / Sin asignar'
              : sucursales.find(s => s.idSucursal === selectedSucursal)?.direccionSucursal}
          </Text>
        </TouchableOpacity>
        {dropdownVisible && (
          <ScrollView style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => { setSelectedSucursal(null); setDropdownVisible(false); }}
            >
              <Text style={[styles.option, selectedSucursal === null && styles.selected]}>
                Todas / Sin asignar
              </Text>
            </TouchableOpacity>
            {sucursales.map(s => (
              <TouchableOpacity
                key={s.idSucursal}
                onPress={() => { setSelectedSucursal(s.idSucursal); setDropdownVisible(false); }}
              >
                <Text style={[styles.option, selectedSucursal === s.idSucursal && styles.selected]}>
                  {s.direccionSucursal}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

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
                  <TouchableOpacity style={styles.editButton} onPress={() => { setSelMachine(item); setSelSucursal(item.idSucursal ?? null); setModalEdit(true); }}>
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.idMaquina)}>
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.line}><Text style={styles.subLabel}>Tipo:</Text> {tipo?.descripcionTipoEquipo}</Text>
              <Text style={styles.line}><Text style={styles.subLabel}>Marca:</Text> {marca?.nombreMarcaMaquina}</Text>
              <Text style={styles.line}><Text style={styles.subLabel}>Sucursal:</Text> {suc?.direccionSucursal ?? 'Sin asignar'}</Text>
            </View>
          );
        }}
      />

      {/* + Nueva Máquina */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalNew(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Gestión de Marcas */}
      <TouchableOpacity style={[styles.addButton, { right: 100, backgroundColor: '#FFA500' }]} onPress={() => setModalMarca(true)}>
        <Text style={styles.addButtonText}>Marcas</Text>
      </TouchableOpacity>

      {/* Modal: Editar Máquina */}
      <Modal visible={modalEdit} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Editar Máquina</Text>
          <Text style={styles.subLabel}>Serial</Text>
          <TextInput style={styles.input} value={selMachine?.idMaquina?.toString() ?? ''} editable={false} />

          <Text style={styles.subLabel}>Marca</Text>
          {marcas.map(ma => (
            <TouchableOpacity key={ma.idMarcaMaquina} onPress={() => setSelMachine(sm => ({ ...sm, idMarcaMaquina: ma.idMarcaMaquina }))}>
              <Text style={[styles.option, selMachine?.idMarcaMaquina === ma.idMarcaMaquina && styles.selected]}>{ma.nombreMarcaMaquina}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subLabel}>Tipo</Text>
          {tipos.map(t => (
            <TouchableOpacity key={t.idTipoEquipo} onPress={() => setSelMachine(sm => ({ ...sm, idTipoEquipo: t.idTipoEquipo }))}>
              <Text style={[styles.option, selMachine?.idTipoEquipo === t.idTipoEquipo && styles.selected]}>{t.descripcionTipoEquipo}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subLabel}>Sucursal</Text>
          <TouchableOpacity onPress={() => setSelSucursal(null)}>
            <Text style={[styles.option, selSucursal === null && styles.selected]}>Sin asignar</Text>
          </TouchableOpacity>
          {sucursales.map(s => (
            <TouchableOpacity key={s.idSucursal} onPress={() => setSelSucursal(s.idSucursal)}>
              <Text style={[styles.option, selSucursal === s.idSucursal && styles.selected]}>{s.direccionSucursal}</Text>
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
          <Text style={styles.subLabel}>Serial (ID Máquina)</Text>
          <TextInput
            placeholder="Serial"
            style={styles.input}
            keyboardType="number-pad"
            value={newMachine.idMaquina}
            onChangeText={text => setNewMachine(nm => ({ ...nm, idMaquina: text }))}
          />

          <Text style={styles.subLabel}>Marca</Text>
          {marcas.map(ma => (
            <TouchableOpacity key={ma.idMarcaMaquina} onPress={() => setNewMachine(nm => ({ ...nm, idMarcaMaquina: ma.idMarcaMaquina }))}>
              <Text style={[styles.option, newMachine.idMarcaMaquina === ma.idMarcaMaquina && styles.selected]}>{ma.nombreMarcaMaquina}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subLabel}>Tipo</Text>
          {tipos.map(t => (
            <TouchableOpacity key={t.idTipoEquipo} onPress={() => setNewMachine(nm => ({ ...nm, idTipoEquipo: t.idTipoEquipo }))}>
              <Text style={[styles.option, newMachine.idTipoEquipo === t.idTipoEquipo && styles.selected]}>{t.descripcionTipoEquipo}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subLabel}>Sucursal</Text>
          <TouchableOpacity onPress={() => setNewSucursal(null)}>
            <Text style={[styles.option, newSucursal === null && styles.selected]}>Sin asignar</Text>
          </TouchableOpacity>
          {sucursales.map(s => (
            <TouchableOpacity key={s.idSucursal} onPress={() => setNewSucursal(s.idSucursal)}>
              <Text style={[styles.option, newSucursal === s.idSucursal && styles.selected]}>{s.direccionSucursal}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalNew(false)} />
            <Button title="Crear"     onPress={handleCreate} />
          </View>
        </ScrollView>
      </Modal>

      {/* Modal: Gestión de Marcas */}
      <Modal visible={modalMarca} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Gestión de Marcas</Text>
          {marcas.map(m => (
            <View key={m.idMarcaMaquina} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
              <Text>{m.nombreMarcaMaquina}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Button
                  title="Editar"
                  onPress={() => {
                    setEditMarca(m);
                    setModalMarcaEdit(true);
                  }}
                />
                <Button
                  title="Eliminar"
                  onPress={() => handleMarcaDelete(m.idMarcaMaquina)}
                />
              </View>
            </View>
          ))}
          <View style={styles.modalButtons}>
            <Button title="Añadir Marca" onPress={() => setModalMarcaNew(true)} />
            <Button title="Cerrar"       onPress={() => setModalMarca(false)} />
          </View>
        </ScrollView>
      </Modal>

      {/* Modal: Nueva Marca */}
      <Modal visible={modalMarcaNew} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Nueva Marca</Text>
          <TextInput
            placeholder="Nombre de Marca"
            style={styles.input}
            value={newMarcaName}
            onChangeText={setNewMarcaName}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalMarcaNew(false)} />
            <Button title="Crear"    onPress={handleMarcaCreate} />
          </View>
        </View>
      </Modal>

      {/* Modal: Editar Marca */}
      <Modal visible={modalMarcaEdit} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Editar Marca</Text>
          <TextInput
            placeholder="Nombre de Marca"
            style={styles.input}
            value={editMarca?.nombreMarcaMaquina ?? ''}
            onChangeText={text => setEditMarca(em => ({ ...em, nombreMarcaMaquina: text }))}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalMarcaEdit(false)} />
            <Button title="Guardar"  onPress={handleMarcaUpdate} />
          </View>
        </View>
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
  addButton:         { position:'absolute', bottom:24, right:24, width:80, height:56, borderRadius:28, backgroundColor:'#007AFF', justifyContent:'center', alignItems:'center', elevation:5 },
  addButtonText:     { color:'#fff', fontSize:14 },
  modal:             { padding:20, backgroundColor:'#fff', flex:1, justifyContent:'center' },
  modalTitle:        { fontSize:18, fontWeight:'bold', marginBottom:12 },
  modalButtons:      { flexDirection:'row', justifyContent:'space-between', marginTop:20 },
  input:             { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:12 }
});
