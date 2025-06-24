import CryptoJS from 'crypto-js';
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

export default function EmpleadosAdmin() {
  const [empleados, setEmpleados]   = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [puestos, setPuestos]       = useState([]);
  const [planillas, setPlanillas]   = useState([]);
  const [loading, setLoading]       = useState(true);

  // — editar empleado —
  const [modalEdit, setModalEdit]   = useState(false);
  const [editEmp, setEditEmp]       = useState(null);
  const [editEmpPwd, setEditEmpPwd] = useState(''); // Para el input visible

  // — nuevo empleado —
  const [modalNew, setModalNew]     = useState(false);
  const [newEmp, setNewEmp]         = useState({
    cedulaEmpleado: '',
    nombreEmpleado: '',
    direccionEmpleado: '',
    correoEmpleado: '',
    passwordEmpleado: '',
    idSucursal: null,
    idPuesto: null,
    idPlanilla: null,
    salarioEmpleado: ''
  });

  useEffect(() => {
    (async () => {
      try {
        const [eRes, sRes, pRes, plRes] = await Promise.all([
          fetch(`${apiUrl}/Empleado`),
          fetch(`${apiUrl}/Sucursal`),
          fetch(`${apiUrl}/Puesto`),
          fetch(`${apiUrl}/Planilla`)
        ]);
        const [eData, sData, pData, plData] = await Promise.all([
          eRes.json(), sRes.json(), pRes.json(), plRes.json()
        ]);
        setEmpleados(eData);
        setSucursales(sData);
        setPuestos(pData);
        setPlanillas(plData);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (cedula) => {
    try {
      const res = await fetch(`${apiUrl}/Empleado/${cedula}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setEmpleados(list => list.filter(e => e.cedulaEmpleado !== cedula));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el empleado.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const suc = sucursales.find(s => s.idSucursal === item.idSucursal);
    const pst = puestos.find(p => p.idPuesto === item.idPuesto);
    const pl  = planillas.find(pl => pl.idPlanilla === item.idPlanilla);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setEditEmp({ ...item, salarioEmpleado: item.salarioEmpleado.toString() });
          setEditEmpPwd(''); // limpia el campo de contraseña al editar
          setModalEdit(true);
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.nombreEmpleado}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.cedulaEmpleado)}
          >
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
        <Text>Cédula: {item.cedulaEmpleado}</Text>
        <Text>Dirección: {item.direccionEmpleado}</Text>
        <Text>Correo: {item.correoEmpleado}</Text>
        <Text>Sucursal: {suc?.direccionSucursal ?? 'Sin asignar'}</Text>
        <Text>Puesto: {pst?.descripcionPuesto}</Text>
        <Text>Planilla: {pl?.descripcionPlanilla}</Text>
        <Text>Salario: ₡{item.salarioEmpleado}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={empleados}
        keyExtractor={item => item.cedulaEmpleado.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.empty}>No hay empleados.</Text>
          </View>
        }
      />

      {/* Botón nuevo empleado */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalNew(true)}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* — Modal Editar — */}
      <Modal visible={modalEdit} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Empleado</Text>
          {editEmp && (
            <>
              <TextInput
                placeholder="Nombre"
                style={styles.input}
                value={editEmp.nombreEmpleado}
                onChangeText={text => setEditEmp(e => ({ ...e, nombreEmpleado: text }))}
              />
              <TextInput
                placeholder="Dirección"
                style={styles.input}
                value={editEmp.direccionEmpleado}
                onChangeText={text => setEditEmp(e => ({ ...e, direccionEmpleado: text }))}
              />
              <TextInput
                placeholder="Correo"
                style={styles.input}
                value={editEmp.correoEmpleado}
                onChangeText={text => setEditEmp(e => ({ ...e, correoEmpleado: text }))}
              />
              <TextInput
                placeholder="Contraseña (dejar vacío para no cambiar)"
                style={styles.input}
                secureTextEntry
                value={editEmpPwd}
                onChangeText={setEditEmpPwd}
              />

              <Text style={styles.label}>Sucursal</Text>
              <TouchableOpacity
                onPress={() => setEditEmp(e => ({ ...e, idSucursal: null }))}
              >
                <Text style={[styles.option, editEmp.idSucursal === null && styles.selected]}>
                  Sin asignar
                </Text>
              </TouchableOpacity>
              {sucursales.map(s => (
                <TouchableOpacity
                  key={s.idSucursal}
                  onPress={() => setEditEmp(e => ({ ...e, idSucursal: s.idSucursal }))}
                >
                  <Text style={[
                    styles.option,
                    editEmp.idSucursal === s.idSucursal && styles.selected
                  ]}>
                    {s.direccionSucursal}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.label}>Puesto</Text>
              {puestos.map(p => (
                <TouchableOpacity
                  key={p.idPuesto}
                  onPress={() => setEditEmp(e => ({ ...e, idPuesto: p.idPuesto }))}
                >
                  <Text style={[
                    styles.option,
                    editEmp.idPuesto === p.idPuesto && styles.selected
                  ]}>
                    {p.descripcionPuesto}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.label}>Planilla</Text>
              {planillas.map(pl => (
                <TouchableOpacity
                  key={pl.idPlanilla}
                  onPress={() => setEditEmp(e => ({ ...e, idPlanilla: pl.idPlanilla }))}
                >
                  <Text style={[
                    styles.option,
                    editEmp.idPlanilla === pl.idPlanilla && styles.selected
                  ]}>
                    {pl.descripcionPlanilla}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.label}>Salario</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={editEmp.salarioEmpleado}
                onChangeText={text => setEditEmp(e => ({ ...e, salarioEmpleado: text }))}
              />

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalEdit(false)} />
                <Button
                  title="Guardar"
                  onPress={async () => {
                    let emp = {
                      ...editEmp,
                      salarioEmpleado: parseFloat(editEmp.salarioEmpleado)
                    };
                    // Solo hashea si el usuario escribió algo nuevo en el campo
                    if (editEmpPwd.trim().length > 0) {
                      emp.passwordEmpleado = CryptoJS.MD5(editEmpPwd).toString();
                    }
                    try {
                      const res = await fetch(`${apiUrl}/Empleado/${emp.cedulaEmpleado}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(emp)
                      });
                      if (!res.ok) throw new Error();
                      setEmpleados(list =>
                        list.map(e => e.cedulaEmpleado === emp.cedulaEmpleado ? emp : e)
                      );
                      setModalEdit(false);
                    } catch {
                      Alert.alert('Error', 'No se pudo actualizar.');
                    }
                  }}
                />
              </View>
            </>
          )}
        </ScrollView>
      </Modal>

      {/* — Modal Nuevo — */}
      <Modal visible={modalNew} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Nuevo Empleado</Text>

          <TextInput
            placeholder="Cédula"
            style={styles.input}
            keyboardType="numeric"
            value={newEmp.cedulaEmpleado}
            onChangeText={text => setNewEmp(ne => ({ ...ne, cedulaEmpleado: text }))}
          />
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={newEmp.nombreEmpleado}
            onChangeText={text => setNewEmp(ne => ({ ...ne, nombreEmpleado: text }))}
          />
          <TextInput
            placeholder="Dirección"
            style={styles.input}
            value={newEmp.direccionEmpleado}
            onChangeText={text => setNewEmp(ne => ({ ...ne, direccionEmpleado: text }))}
          />
          <TextInput
            placeholder="Correo"
            style={styles.input}
            value={newEmp.correoEmpleado}
            onChangeText={text => setNewEmp(ne => ({ ...ne, correoEmpleado: text }))}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry
            value={newEmp.passwordEmpleado}
            onChangeText={text => setNewEmp(ne => ({ ...ne, passwordEmpleado: text }))}
          />

          <Text style={styles.label}>Sucursal</Text>
          <TouchableOpacity
            onPress={() => setNewEmp(ne => ({ ...ne, idSucursal: null }))}
          >
            <Text style={[styles.option, newEmp.idSucursal === null && styles.selected]}>
              Sin asignar
            </Text>
          </TouchableOpacity>
          {sucursales.map(s => (
            <TouchableOpacity
              key={s.idSucursal}
              onPress={() => setNewEmp(ne => ({ ...ne, idSucursal: s.idSucursal }))}
            >
              <Text style={[
                styles.option,
                newEmp.idSucursal === s.idSucursal && styles.selected
              ]}>
                {s.direccionSucursal}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Puesto</Text>
          {puestos.map(p => (
            <TouchableOpacity
              key={p.idPuesto}
              onPress={() => setNewEmp(ne => ({ ...ne, idPuesto: p.idPuesto }))}
            >
              <Text style={[
                styles.option,
                newEmp.idPuesto === p.idPuesto && styles.selected
              ]}>
                {p.descripcionPuesto}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Planilla</Text>
          {planillas.map(pl => (
            <TouchableOpacity
              key={pl.idPlanilla}
              onPress={() => setNewEmp(ne => ({ ...ne, idPlanilla: pl.idPlanilla }))}
            >
              <Text style={[
                styles.option,
                newEmp.idPlanilla === pl.idPlanilla && styles.selected
              ]}>
                {pl.descripcionPlanilla}
              </Text>
            </TouchableOpacity>
          ))}

          <TextInput
            placeholder="Salario"
            style={styles.input}
            keyboardType="numeric"
            value={newEmp.salarioEmpleado}
            onChangeText={text => setNewEmp(ne => ({ ...ne, salarioEmpleado: text }))}
          />

          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => setModalNew(false)} />
            <Button title="Crear" onPress={async () => {
              const ne = {
                ...newEmp,
                salarioEmpleado: parseFloat(newEmp.salarioEmpleado)
              };
              if (
                !ne.cedulaEmpleado ||
                !ne.nombreEmpleado ||
                !ne.direccionEmpleado ||
                !ne.correoEmpleado ||
                !ne.passwordEmpleado ||
                !ne.idPuesto ||
                !ne.idPlanilla ||
                isNaN(ne.salarioEmpleado)
              ) {
                Alert.alert('Error', 'Complete todos los campos.');
                return;
              }
              try {
                ne.passwordEmpleado = CryptoJS.MD5(ne.passwordEmpleado).toString()
                const res = await fetch(`${apiUrl}/Empleado`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(ne)
                });
                if (!res.ok) throw new Error();
                const created = await res.json();
                setEmpleados(list => [...list, created]);
                setModalNew(false);
                setNewEmp({
                  cedulaEmpleado:'', nombreEmpleado:'', direccionEmpleado:'',
                  correoEmpleado:'', passwordEmpleado:'',
                  idSucursal:null, idPuesto:null, idPlanilla:null, salarioEmpleado:''
                });
              } catch {
                Alert.alert('Error', 'No se pudo crear empleado.');
              }
            }} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:        { flex:1, justifyContent:'center', alignItems:'center' },
  container:     { flex:1, backgroundColor:'#fff' },
  card:          { padding:16, margin:12, backgroundColor:'#fafafa', borderRadius:6 },
  cardHeader:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  name:          { fontSize:18, fontWeight:'600', marginBottom:4 },
  deleteButton:  { backgroundColor:'#FF3B30', padding:6, borderRadius:4 },
  deleteText:    { color:'#fff' },
  empty:         { textAlign:'center', marginTop:20 },
  addButton:     { position:'absolute', bottom:24, right:24, width:56, height:56, borderRadius:28, backgroundColor:'#007AFF', justifyContent:'center', alignItems:'center', shadowColor:'#000', shadowOpacity:0.3, shadowOffset:{ width:0, height:2 }, shadowRadius:4, elevation:5 },
  addButtonText: { color:'#fff', fontSize:32 },
  modalContent:  { padding:20, backgroundColor:'#fff' },
  modalTitle:    { fontSize:20, fontWeight:'bold', marginBottom:12 },
  label:         { marginTop:12, fontWeight:'600' },
  input:         { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:8, marginBottom:12 },
  option:        { padding:8 },
  selected:      { color:'#007AFF', fontWeight:'bold' },
  modalButtons:  { flexDirection:'row', justifyContent:'space-between', marginTop:20 }
});
