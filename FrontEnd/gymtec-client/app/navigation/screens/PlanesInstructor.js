import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function PlanesInstructor() {
  const [clases, setClases]       = useState([]);
  const [clientes, setClientes]   = useState([]);
  const [asistencias, setAsist]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cedIns, setCedIns]       = useState(null);
  const [selected, setSelected]   = useState(null); // clase seleccionada
  const [modalVisible, setModal]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Obtener ID del instructor
        const ced = await AsyncStorage.getItem('cedulaEmpleado');
        setCedIns(+ced);

        // Cargar clases, clientes y asistencias
        const [cRes, clRes, aRes] = await Promise.all([
          fetch(`${apiUrl}/Clase`),
          fetch(`${apiUrl}/Cliente`),
          fetch(`${apiUrl}/AsistenciaClase`)
        ]);
        const [cData, clData, aData] = await Promise.all([
          cRes.json(), clRes.json(), aRes.json()
        ]);

        // Filtrar solo clases de este instructor
        setClases(cData.filter(c => c.idInstructorClase === +ced));
        // Mapear clientes a camelCase
        setClientes(clData.map(c => ({
          cedulaCliente:   c.cedulaCliente   ?? c.CedulaCliente,
          nombreCliente:   c.nombreCliente   ?? c.NombreCliente,
          apellidosCliente:c.apellidosCliente?? c.ApellidosCliente,
          idInstructor:    c.idInstructor    ?? c.IdInstructor
        })));
        // Mapear asistencias
        setAsist(aData.map(a => ({
          cedulaCliente: a.cedulaCliente ?? a.CedulaCliente,
          idClase:       a.idClase       ?? a.IdClase
        })));
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No fue posible cargar los datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDetails = clase => {
    setSelected(clase);
    setModal(true);
  };

  const handleRegister = cedulaCliente => {
    fetch(`${apiUrl}/AsistenciaClase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedulaCliente, idClase: selected.idClase })
    })
      .then(r => {
        if (!r.ok) throw new Error();
        setAsist(a => [...a, { cedulaCliente, idClase: selected.idClase }]);
      })
      .catch(() => Alert.alert('Error', 'No se pudo registrar.'));
  };

  const handleRemove = cedulaCliente => {
    fetch(
      `${apiUrl}/AsistenciaClase/${cedulaCliente}/${selected.idClase}`,
      { method: 'DELETE' }
    )
      .then(r => {
        if (!r.ok) throw new Error();
        setAsist(a =>
          a.filter(
            x =>
              !(
                x.cedulaCliente === cedulaCliente &&
                x.idClase === selected.idClase
              )
          )
        );
      })
      .catch(() => Alert.alert('Error', 'No se pudo remover.'));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Cuando una clase está seleccionada, preparamos las dos listas:
  let attending = [];
  let instrClients = [];
  if (selected) {
    const clsId = selected.idClase;
    const attends = asistencias
      .filter(a => a.idClase === clsId)
      .map(a => a.cedulaCliente);

    attending = clientes.filter(c =>
      attends.includes(c.cedulaCliente)
    );

    instrClients = clientes.filter(
      c =>
        c.idInstructor === cedIns &&
        !attends.includes(c.cedulaCliente)
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clases}
        keyExtractor={item => item.idClase.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openDetails(item)}
          >
            <Text style={styles.title}>
              Clase #{item.idClase}
            </Text>
            <Text>Tipo: {item.tipoClase}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tienes clases asignadas.
          </Text>
        }
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            Clase #{selected?.idClase} — Clientes
          </Text>

          <Text style={styles.subTitle}>Asistentes:</Text>
          <FlatList
            data={attending}
            keyExtractor={c => c.cedulaCliente.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text>
                  {item.nombreCliente} {item.apellidosCliente}
                </Text>
                <Button
                  title="Remover"
                  onPress={() => handleRemove(item.cedulaCliente)}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>Sin asistentes.</Text>
            }
          />

          <Text style={styles.subTitle}>
            Tus Clientes:
          </Text>
          <FlatList
            data={instrClients}
            keyExtractor={c => c.cedulaCliente.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text>
                  {item.nombreCliente} {item.apellidosCliente}
                </Text>
                <Button
                  title="Registrar"
                  onPress={() =>
                    handleRegister(item.cedulaCliente)
                  }
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No tienes más clientes.
              </Text>
            }
          />

          <Button
            title="Cerrar"
            onPress={() => setModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:      { flex:1,justifyContent:'center',alignItems:'center' },
  container:   { flex:1, padding:16, backgroundColor:'#fff' },
  card:        {
                 padding:12,
                 marginVertical:6,
                 backgroundColor:'#fafafa',
                 borderRadius:6
               },
  title:       { fontSize:16, fontWeight:'600' },
  empty:       { textAlign:'center',marginTop:20 },
  modal:       { flex:1,padding:16,backgroundColor:'#fff' },
  modalTitle:  { fontSize:18,fontWeight:'bold',marginBottom:12 },
  subTitle:    { fontSize:16,fontWeight:'600',marginTop:12 },
  row:         {
                 flexDirection:'row',
                 justifyContent:'space-between',
                 alignItems:'center',
                 paddingVertical:6
               }
});
