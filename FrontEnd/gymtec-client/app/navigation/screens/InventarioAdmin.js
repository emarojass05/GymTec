import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function InventarioAdmin() {
  const [maquinas, setMaquinas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtro sucursal
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Para reasignar
  const [modalEdit, setModalEdit] = useState(false);
  const [selMachine, setSelMachine] = useState(null);
  const [selSucursal, setSelSucursal] = useState(null);

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        idMaquina: selMachine.idMaquina,
        idMarcaMaquina: selMachine.idMarcaMaquina,
        idTipoEquipo: selMachine.idTipoEquipo,
        idSucursal: selSucursal
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
      setSelMachine(null);
      setSelSucursal(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Error','No se pudo reasignar.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  // filtrar máquinas según sucursal seleccionada o sin asignar
  const filtered = maquinas.filter(m =>
    selectedSucursal === null
      ? true
      : m.idSucursal === selectedSucursal || m.idSucursal == null
  );

  return (
    <View style={styles.container}>
      {/* Dropdown de sucursales */}
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
              onPress={() => {
                setSelectedSucursal(null);
                setDropdownVisible(false);
              }}
            >
              <Text style={[styles.option, selectedSucursal === null && styles.selected]}>
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
                <Text style={[
                  styles.option,
                  selectedSucursal === s.idSucursal && styles.selected
                ]}>
                  {s.direccionSucursal}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.idMaquina.toString()}
        renderItem={({ item }) => {
          const tipo  = tipos.find(x => x.idTipoEquipo === item.idTipoEquipo);
          const marca = marcas.find(x => x.idMarcaMaquina === item.idMarcaMaquina);
          const suc   = sucursales.find(x => x.idSucursal === item.idSucursal);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelMachine(item);
                setSelSucursal(item.idSucursal);
                setModalEdit(true);
              }}
            >
              <Text style={styles.line}>
                <Text style={styles.label}>Serial:</Text> {item.idMaquina}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Tipo:</Text> {tipo?.descripcionTipoEquipo}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Marca:</Text> {marca?.nombreMarcaMaquina}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Sucursal:</Text> {suc?.direccionSucursal ?? 'Sin asignar'}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No hay máquinas.</Text>}
      />

      {/* Modal reasignar */}
      <Modal visible={modalEdit} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Reasignar Sucursal</Text>
          {sucursales.map(s => (
            <TouchableOpacity
              key={s.idSucursal}
              onPress={() => setSelSucursal(s.idSucursal)}
            >
              <Text style={[
                styles.option,
                selSucursal === s.idSucursal && styles.selected
              ]}>
                {s.direccionSucursal}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={()=>setModalEdit(false)} />
            <Button title="Guardar" onPress={handleSave} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:         { flex:1, justifyContent:'center', alignItems:'center' },
  container:      { flex:1, padding:20, backgroundColor:'#fff' },

  filterContainer:{ marginBottom:12 },
  filterButton:   { padding:12, backgroundColor:'#eee', borderRadius:6 },
  filterButtonText:{ fontSize:16 },
  dropdown:       { backgroundColor:'#fafafa', borderRadius:6, maxHeight:150, marginTop:4 },
  
  card:           {
                    padding:16,
                    marginBottom:12,
                    backgroundColor:'#fafafa',
                    borderRadius:6,
                    borderWidth:1,
                    borderColor:'#ddd'
                  },
  line:           { marginBottom:6 },
  label:          { fontWeight:'600' },
  empty:          { textAlign:'center', marginTop:20, color:'#666' },

  modal:          { padding:20, backgroundColor:'#fff' },
  modalTitle:     { fontSize:18, fontWeight:'bold', marginBottom:12 },
  option:         { padding:12 },
  selected:       { color:'#007AFF', fontWeight:'bold' },
  modalButtons:   {
                    flexDirection:'row',
                    justifyContent:'space-between',
                    marginTop:20
                  }
});
