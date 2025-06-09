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

  // modal nuevo
  const [modalNew, setModalNew]   = useState(false);
  const [newProd, setNewProd]     = useState({
    codigoBarrasProducto: '',
    nombreProducto: '',
    descripcionProducto: '',
    costoProducto: '',
  });

  // modal editar
  const [modalEdit, setModalEdit] = useState(false);
  const [editProd, setEditProd]   = useState(null);

  useEffect(() => {
    load();
  }, []);

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
      const res = await fetch(`${apiUrl}/Producto/${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
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
    try {
      const body = {
        codigoBarrasProducto: parseInt(codigoBarrasProducto, 10),
        nombreProducto: nombreProducto.trim(),
        descripcionProducto: descripcionProducto.trim(),
        costoProducto: parseFloat(costoProducto),
      };
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
    const { codigoBarrasProducto, descripcionProducto, costoProducto } = editProd;
    if (!descripcionProducto.trim() || !costoProducto) {
      Alert.alert('Error', 'Complete descripción y costo.');
      return;
    }
    try {
      const body = {
        codigoBarrasProducto,
        nombreProducto: editProd.nombreProducto,           // nombre fijo
        descripcionProducto: descripcionProducto.trim(),
        costoProducto: parseFloat(costoProducto),
      };
      const res = await fetch(`${apiUrl}/Producto/${codigoBarrasProducto}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setProductos(prev =>
        prev.map(p =>
          p.codigoBarrasProducto === codigoBarrasProducto ? body : p
        )
      );
      setModalEdit(false);
      setEditProd(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

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
                  setEditProd({
                    ...item,
                    costoProducto: item.costoProducto.toString()
                  });
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
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos.</Text>}
      />

      {/* + Nuevo producto */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal Nuevo */}
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

      {/* Modal Editar */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  center:         { flex:1, justifyContent:'center', alignItems:'center' },
  container:      { flex:1, backgroundColor:'#fff', padding:20 },
  card:           {
                    padding:16,
                    marginBottom:12,
                    backgroundColor:'#fafafa',
                    borderRadius:6,
                    borderWidth:1,
                    borderColor:'#ddd'
                  },
  label:          { fontWeight:'600' },
  buttonsRow:     { flexDirection:'row', justifyContent:'flex-end', marginTop:8 },
  btnSmall:       {
                    backgroundColor:'#007AFF',
                    paddingVertical:4,
                    paddingHorizontal:8,
                    borderRadius:4,
                    marginRight:8
                  },
  btnDelete:      {
                    backgroundColor:'#FF3B30',
                    paddingVertical:4,
                    paddingHorizontal:8,
                    borderRadius:4
                  },
  btnText:        { color:'#fff', fontWeight:'bold' },
  empty:          { textAlign:'center', marginTop:20 },

  addButton:      {
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
  addButtonText:  { color:'#fff', fontSize:32 },

  modalOverlay:   {
                    flex:1,
                    backgroundColor:'rgba(0,0,0,0.5)',
                    justifyContent:'center',
                    padding:20
                  },
  modalContent:   {
                    backgroundColor:'#fff',
                    borderRadius:8,
                    padding:16,
                    maxHeight:'80%'
                  },
  modalTitle:     { fontSize:18, fontWeight:'bold', marginBottom:12 },
  input:          {
                    borderWidth:1,
                    borderColor:'#ccc',
                    borderRadius:6,
                    padding:8,
                    marginBottom:12
                  },
  modalButtons:   { flexDirection:'row', justifyContent:'space-between' }
});
