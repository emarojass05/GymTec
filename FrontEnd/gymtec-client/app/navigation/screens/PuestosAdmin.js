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

export default function PuestosAdmin() {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [newDescripcion, setNewDescripcion] = useState('');

  useEffect(() => {
    fetchPuestos();
  }, []);

  const fetchPuestos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/Puesto`);
      const data = await res.json();
      setPuestos(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo cargar los puestos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/Puesto/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setPuestos(ps => ps.filter(p => p.idPuesto !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el puesto.');
    }
  };

  const handleAdd = async () => {
    const desc = newDescripcion.trim();
    if (!desc) {
      Alert.alert('Error', 'Ingrese una descripción.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/Puesto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcionPuesto: desc })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setPuestos(ps => [...ps, created]);
      setNewDescripcion('');
      setModalVisible(false);
    } catch {
      Alert.alert('Error', 'No se pudo crear el puesto.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={puestos}
        keyExtractor={item => item.idPuesto.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.descripcionPuesto}</Text>
            {item.idPuesto > 4 ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.idPuesto)}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lockedText}>Fijo</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay puestos.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Puesto</Text>
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={newDescripcion}
              onChangeText={setNewDescripcion}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Crear" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container:   { flex: 1, backgroundColor: '#fff', padding: 20 },
  card:        {
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 padding: 16,
                 marginBottom: 12,
                 backgroundColor: '#fafafa',
                 borderRadius: 6
               },
  text:        { fontSize: 16, flex: 1 },
  deleteButton:{
                 backgroundColor: '#FF3B30',
                 paddingVertical: 4,
                 paddingHorizontal: 8,
                 borderRadius: 4
               },
  deleteText:  { color: '#fff' },
  lockedText:  { color: '#999', fontStyle: 'italic' },
  empty:       { textAlign: 'center', marginTop: 20 },

  addButton:   {
                 position: 'absolute',
                 bottom: 24,
                 right: 24,
                 width: 56,
                 height: 56,
                 borderRadius: 28,
                 backgroundColor: '#007AFF',
                 justifyContent: 'center',
                 alignItems: 'center',
                 shadowColor: '#000',
                 shadowOpacity: 0.3,
                 shadowOffset: { width: 0, height: 2 },
                 shadowRadius: 4,
                 elevation: 5
               },
  addButtonText:{ color: '#fff', fontSize: 32 },

  modalOverlay:{
                 flex: 1,
                 backgroundColor: 'rgba(0,0,0,0.5)',
                 justifyContent: 'center',
                 padding: 20
               },
  modalContent:{
                 backgroundColor: '#fff',
                 borderRadius: 8,
                 padding: 16
               },
  modalTitle:  { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input:       {
                 borderWidth: 1,
                 borderColor: '#ccc',
                 borderRadius: 6,
                 padding: 8,
                 marginBottom: 12
               },
  modalButtons:{
                 flexDirection: 'row',
                 justifyContent: 'space-between'
               }
});
