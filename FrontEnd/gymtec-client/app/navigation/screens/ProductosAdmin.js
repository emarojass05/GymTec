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

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);

  // CRUD
  const [modalNew, setModalNew]   = useState(false);
  const [newProd, setNewProd]     = useState({
    codigoBarrasProducto: '',
    nombreProducto: '',
    descripcionProducto: '',
    costoProducto: '',
  });
  const [modalEdit, setModalEdit] = useState(false);
  const [editProd, setEditProd]   = useState(null);

  // Asignar/Remover
  const [sucursales, setSucursales]     = useState([]);
  const [tiendas, setTiendas]           = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [modalAssign, setModalAssign]   = useState(false);
  const [currentProd, setCurrentProd]   = useState(null);
  const [selSucursales, setSelSucursales] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pRes, sRes, tRes, aRes] = await Promise.all([
          fetch(`${apiUrl}/Producto`),
          fetch(`${apiUrl}/Sucursal`),
          fetch(`${apiUrl}/Tienda`),
          fetch(`${apiUrl}/TiendaProducto`),
        ]);
        const productosList = pRes.ok ? await pRes.json() : [];
        setProductos(productosList);

        const sucList = sRes.ok ? await sRes.json() : [];
        setSucursales(sucList);

        const tiList = tRes.ok ? await tRes.json() : [];
        setTiendas(tiList);

        const asgnList = aRes.ok ? await aRes.json() : [];
        setAsignaciones(asgnList);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Refrescar sólo asignaciones
  const refreshAsignaciones = async () => {
    try {
      const res  = await fetch(`${apiUrl}/TiendaProducto`);
      const text = res.ok ? await res.text() : '';
      setAsignaciones(text ? JSON.parse(text) : []);
    } catch (err) {
      console.error(err);
    }
  };

  // CRUD Handlers
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/Producto`);
      const list = res.ok ? await res.json() : [];
      setProductos(list);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async codigo => {
    try {
      await fetch(`${apiUrl}/Producto/${codigo}`, { method: 'DELETE' });
      setProductos(prev => prev.filter(p => p.codigoBarrasProducto !== codigo));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el producto.');
    }
  };

  const handleCreate = async () => {
    const { codigoBarrasProducto, nombreProducto, descripcionProducto, costoProducto } = newProd;
    if (!codigoBarrasProducto || !nombreProducto.trim() || !descripcionProducto.trim() || !costoProducto) {
      Alert.alert('Error', 'Complete todos los campos.');
      return;
    }
    const body = {
      codigoBarrasProducto: parseInt(codigoBarrasProducto, 10),
      nombreProducto: nombreProducto.trim(),
      descripcionProducto: descripcionProducto.trim(),
      costoProducto: parseFloat(costoProducto),
    };
    try {
      const res = await fetch(`${apiUrl}/Producto`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setProductos(prev => [...prev, created]);
      setModalNew(false);
      setNewProd({ codigoBarrasProducto:'', nombreProducto:'', descripcionProducto:'', costoProducto:'' });
    } catch {
      Alert.alert('Error', 'No se pudo crear el producto.');
    }
  };

  const handleUpdate = async () => {
    const { codigoBarrasProducto, descripcionProducto, costoProducto, nombreProducto } = editProd;
    if (!descripcionProducto.trim() || !costoProducto) {
      Alert.alert('Error', 'Complete descripción y costo.');
      return;
    }
    const body = {
      codigoBarrasProducto,
      nombreProducto,
      descripcionProducto: descripcionProducto.trim(),
      costoProducto: parseFloat(costoProducto),
    };
    try {
      const res = await fetch(`${apiUrl}/Producto/${codigoBarrasProducto}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setProductos(prev => prev.map(p => p.codigoBarrasProducto === codigoBarrasProducto ? body : p));
      setModalEdit(false);
      setEditProd(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    }
  };

  // Asignar/Remover Handlers
  const openAssignModal = producto => {
    setCurrentProd(producto);
    const assigned = asignaciones
      .filter(a => a.codigoBarrasProducto === producto.codigoBarrasProducto)
      .map(a => {
        const t = tiendas.find(t => t.idTienda === a.idTienda);
        return t?.idSucursal;
      })
      .filter(Boolean);
    setSelSucursales(Array.from(new Set(assigned)));
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
      const toRemove = asignaciones.filter(
        a => a.codigoBarrasProducto === currentProd.codigoBarrasProducto
      );
      await Promise.all(
        toRemove.map(a =>
          fetch(
            `${apiUrl}/TiendaProducto/${a.idTienda}/${a.codigoBarrasProducto}`,
            { method: 'DELETE' }
          )
        )
      );
      await Promise.all(
        selSucursales.map(idSucursal => {
          const tiendasEnSuc = tiendas.filter(t => t.idSucursal === idSucursal);
          return Promise.all(
            tiendasEnSuc.map(t =>
              fetch(`${apiUrl}/TiendaProducto`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({
                  idTienda: t.idTienda,
                  codigoBarrasProducto: currentProd.codigoBarrasProducto,
                }),
              })
            )
          );
        })
      );
      await refreshAsignaciones();
      setModalAssign(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar las asignaciones.');
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={item => item.codigoBarrasProducto.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text><Text style={styles.label}>Código:</Text> {item.codigoBarrasProducto}</Text>
            <Text><Text style={styles.label}>Nombre:</Text> {item.nombreProducto}</Text>
            <Text><Text style={styles.label}>Descripción:</Text> {item.descripcionProducto}</Text>
            <Text><Text style={styles.label}>Costo:</Text> ₡{item.costoProducto}</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.btnSmall}
                onPress={() => {
                  setEditProd({ ...item, costoProducto: item.costoProducto.toString() });
                  setModalEdit(true);
                }}
              >
                <Text style={styles.btnText}>Modificar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDelete(item.codigoBarrasProducto)}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnAssign}
                onPress={() => openAssignModal(item)}
              >
                <Text style={styles.btnText}>Asignar/Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos.</Text>}
      />

      {/* + Nuevo Producto */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalNew(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal: Nuevo Producto */}
      <Modal visible={modalNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Producto</Text>
            <ScrollView>
              <TextInput
                placeholder="Código de Barras"
                style={styles.input}
                keyboardType="numeric"
                value={newProd.codigoBarrasProducto}
                onChangeText={t => setNewProd(n => ({ ...n, codigoBarrasProducto: t }))}
              />
              <TextInput
                placeholder="Nombre"
                style={styles.input}
                value={newProd.nombreProducto}
                onChangeText={t => setNewProd(n => ({ ...n, nombreProducto: t }))}
              />
              <TextInput
                placeholder="Descripción"
                style={styles.input}
                value={newProd.descripcionProducto}
                onChangeText={t => setNewProd(n => ({ ...n, descripcionProducto: t }))}
              />
              <TextInput
                placeholder="Costo"
                style={styles.input}
                keyboardType="numeric"
                value={newProd.costoProducto}
                onChangeText={t => setNewProd(n => ({ ...n, costoProducto: t }))}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalNew(false)} />
                <Button title="Crear" onPress={handleCreate} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Editar Producto */}
      <Modal visible={modalEdit} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modificar Producto</Text>
            <ScrollView>
              <Text><Text style={styles.label}>Código:</Text> {editProd?.codigoBarrasProducto}</Text>
              <Text><Text style={styles.label}>Nombre:</Text> {editProd?.nombreProducto}</Text>
              <TextInput
                placeholder="Descripción"
                style={styles.input}
                value={editProd?.descripcionProducto}
                onChangeText={t => setEditProd(e => ({ ...e, descripcionProducto: t }))}
              />
              <TextInput
                placeholder="Costo"
                style={styles.input}
                keyboardType="numeric"
                value={editProd?.costoProducto}
                onChangeText={t => setEditProd(e => ({ ...e, costoProducto: t }))}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalEdit(false)} />
                <Button title="Guardar" onPress={handleUpdate} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Asignar/Remover */}
      <Modal visible={modalAssign} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Producto: {currentProd?.nombreProducto}
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
  center:         { flex:1, justifyContent:'center', alignItems:'center' },
  container:      { flex:1, backgroundColor:'#fff', padding:20 },
  card:           { padding:16, marginBottom:12, backgroundColor:'#fafafa', borderRadius:6, borderWidth:1, borderColor:'#ddd' },
  label:          { fontWeight:'600' },
  buttonsRow:     { flexDirection:'row', justifyContent:'flex-end', marginTop:8 },
  btnSmall:       { backgroundColor:'#007AFF', paddingVertical:4, paddingHorizontal:8, borderRadius:4, marginRight:8 },
  btnDelete:      { backgroundColor:'#FF3B30', paddingVertical:4, paddingHorizontal:8, borderRadius:4, marginRight:8 },
  btnAssign:      { backgroundColor:'#28A745', paddingVertical:4, paddingHorizontal:8, borderRadius:4 },
  btnText:        { color:'#fff', fontWeight:'bold' },
  empty:          { textAlign:'center', marginTop:20 },
  addButton:      { position:'absolute', bottom:24, right:24, width:56, height:56, borderRadius:28, backgroundColor:'#28A745', justifyContent:'center', alignItems:'center', elevation:5 },
  addButtonText:  { color:'#fff', fontSize:32 },
  modalOverlay:   { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', padding:20 },
  modalContent:   { backgroundColor:'#fff', borderRadius:8, padding:16, maxHeight:'80%' },
  modalTitle:     { fontSize:18, fontWeight:'bold', marginBottom:12 },
  input:          { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:12 },
  modalButtons:   { flexDirection:'row', justifyContent:'space-between' },
  modalContainer: { flex:1, padding:20, backgroundColor:'#fff' },
  subTitle:       { fontSize:16, fontWeight:'600', marginBottom:8 },
  option:         { padding:12 },
  selected:       { color:'#007AFF', fontWeight:'bold' },
});
