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

export default function TiposEquipoAdmin() {
  const [tipos, setTipos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNew, setModalNew] = useState(false);
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/TipoEquipo`);
        const list = res.ok ? await res.json() : [];
        setTipos(list);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar tipos de equipo.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async () => {
    const desc = newDesc.trim();
    if (!desc) {
      Alert.alert('Error', 'Ingrese descripción.');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/TipoEquipo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ descripcionTipoEquipo: desc })
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTipos(prev => [...prev, created]);
      setNewDesc('');
      setModalNew(false);
    } catch {
      Alert.alert('Error', 'No se pudo crear tipo de equipo.');
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`${apiUrl}/TipoEquipo/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setTipos(prev => prev.filter(t => t.idTipoEquipo !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar tipo de equipo.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tipos}
        keyExtractor={item => item.idTipoEquipo.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.descripcionTipoEquipo}</Text>
            {item.idTipoEquipo > 4 && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.idTipoEquipo)}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay tipos de equipo.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Tipo de Equipo</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container:    { flex: 1, backgroundColor: '#fff', padding: 20 },
  card:         {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  marginBottom: 12,
                  backgroundColor: '#fafafa',
                  borderRadius: 6
                },
  text:         { fontSize: 16, flex: 1 },
  deleteBtn:    {
                  backgroundColor: '#FF3B30',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 4
                },
  deleteText:   { color: '#fff', fontWeight: 'bold' },
  empty:        { textAlign: 'center', marginTop: 20 },

  addButton:    {
                  position: 'absolute',
                  bottom: 24,
                  right: 24,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#007AFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5
                },
  addButtonText:{ color: '#fff', fontSize: 32 },

  modalOverlay: {
                  flex:1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  padding: 20
                },
  modalContent: {
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  padding: 16
                },
  modalTitle:   { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input:        {
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 6,
                  padding: 8,
                  marginBottom: 12
                },
  modalButtons: {
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }
});
