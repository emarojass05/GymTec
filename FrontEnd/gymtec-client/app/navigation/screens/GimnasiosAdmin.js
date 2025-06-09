// app/navigation/screens/GimnasiosAdmin.js
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
    View,
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function GimnasiosAdmin() {
  const [sucursales, setSucursales]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [copiedSourceId, setCopiedSourceId] = useState(null);

  // Estado para el modal "nuevo gimnasio"
  const [modalNew, setModalNew]       = useState(false);
  const [newSucursal, setNewSucursal] = useState({
    direccionSucursal: '',
    fechaApertura:     '',
    horarioAtencion:   ''
  });

  useEffect(() => {
    loadSucursales();
  }, []);

  const loadSucursales = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${apiUrl}/Sucursal`);
      const data = await res.json();
      setSucursales(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar las sucursales.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/Sucursal/${id}/CopyData`);
      if (!res.ok) throw new Error();
      // <-- Eliminamos el `await res.json()` porque el endpoint no devuelve body
      setCopiedSourceId(id);
      Alert.alert('Copiado', `Datos de sucursal ${id} copiados.`);
    } catch {
      Alert.alert('Error', 'No pude copiar los datos.');
    }
  };

  const handlePaste = (targetId) => {
    if (!copiedSourceId) {
      return Alert.alert('Atención', 'Primero debes copiar datos de una sucursal.');
    }
    if (targetId === copiedSourceId) {
      return Alert.alert('Info', 'No puedes pegar en la misma sucursal.');
    }

    Alert.alert(
      'Confirmar',
      `Vas a sobreescribir los datos de la sucursal ${targetId}. ¿Continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              const res = await fetch(
                `${apiUrl}/Sucursal/${targetId}/PasteData/${copiedSourceId}`,
                { method: 'POST' }
              );
              if (!res.ok) throw new Error();
              Alert.alert('Éxito', 'Datos pegados correctamente.');
              setCopiedSourceId(null);
              loadSucursales();
            } catch {
              Alert.alert('Error', 'No pude pegar los datos.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleCreate = async () => {
    const { direccionSucursal, fechaApertura, horarioAtencion } = newSucursal;
    if (!direccionSucursal || !fechaApertura || !horarioAtencion) {
      return Alert.alert('Error', 'Complete todos los campos.');
    }
    try {
      const res = await fetch(`${apiUrl}/Sucursal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direccionSucursal,
          fechaApertura: new Date(fechaApertura).toISOString(),
          horarioAtencion
        })
      });
      if (!res.ok) throw new Error();
      setModalNew(false);
      setNewSucursal({ direccionSucursal:'', fechaApertura:'', horarioAtencion:'' });
      loadSucursales();
      Alert.alert('Éxito', 'Sucursal creada correctamente.');
    } catch {
      Alert.alert('Error', 'No pude crear la sucursal.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={sucursales}
        keyExtractor={item => item.idSucursal.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.direccionSucursal}</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => handleCopy(item.idSucursal)}
              >
                <Text style={styles.btnText}>Copiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pasteBtn}
                onPress={() => handlePaste(item.idSucursal)}
              >
                <Text style={styles.btnText}>Pegar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay gimnasios.</Text>}
      />

      {/* Botón flotante para "Nuevo gimnasio" */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋ Nuevo gimnasio</Text>
      </TouchableOpacity>

      {/* Modal creación de sucursal */}
      <Modal visible={modalNew} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Sucursal</Text>

            <TextInput
              placeholder="Dirección"
              style={styles.input}
              value={newSucursal.direccionSucursal}
              onChangeText={t => setNewSucursal(s => ({ ...s, direccionSucursal: t }))}
            />
            <TextInput
              placeholder="Fecha apertura (YYYY-MM-DD)"
              style={styles.input}
              value={newSucursal.fechaApertura}
              onChangeText={t => setNewSucursal(s => ({ ...s, fechaApertura: t }))}
            />
            <TextInput
              placeholder="Horario atención"
              style={styles.input}
              value={newSucursal.horarioAtencion}
              onChangeText={t => setNewSucursal(s => ({ ...s, horarioAtencion: t }))}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalNew(false)} />
              <Button title="Crear"    onPress={handleCreate} />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex:1, backgroundColor:'#fff' },
  center:        { flex:1, justifyContent:'center', alignItems:'center' },
  card:          {
                   padding:16,
                   margin:12,
                   backgroundColor:'#fafafa',
                   borderRadius:6,
                   borderWidth:1,
                   borderColor:'#ddd'
                 },
  name:          { fontSize:16, marginBottom:8, fontWeight:'600' },
  buttonsRow:    { flexDirection:'row', justifyContent:'space-between' },
  copyBtn:       {
                   backgroundColor:'#007AFF',
                   padding:8,
                   borderRadius:4
                 },
  pasteBtn:      {
                   backgroundColor:'#28A745',
                   padding:8,
                   borderRadius:4
                 },
  btnText:       { color:'#fff', fontWeight:'600' },
  empty:         { textAlign:'center', marginTop:20 },

  addButton:     {
                   position:'absolute',
                   bottom:24,
                   right:24,
                   backgroundColor:'#444',
                   paddingVertical:12,
                   paddingHorizontal:16,
                   borderRadius:8,
                   elevation:5
                 },
  addButtonText: { color:'#fff', fontWeight:'bold' },

  modalOverlay:  {
                   flex:1,
                   backgroundColor:'rgba(0,0,0,0.5)',
                   justifyContent:'center',
                   padding:20
                 },
  modalContent:  {
                   backgroundColor:'#fff',
                   borderRadius:8,
                   padding:16
                 },
  modalTitle:    { fontSize:18, fontWeight:'bold', marginBottom:12 },
  input:         {
                   borderWidth:1,
                   borderColor:'#ccc',
                   borderRadius:6,
                   padding:8,
                   marginBottom:12
                 },
  modalButtons:  {
                   flexDirection:'row',
                   justifyContent:'space-between'
                 }
});
