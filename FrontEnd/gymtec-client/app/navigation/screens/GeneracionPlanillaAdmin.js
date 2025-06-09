// app/navigation/screens/GeneracionPlanillaAdmin.js
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SectionList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { apiUrl } from '../../../utils';

export default function GeneracionPlanillaAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchPlanilla();
  }, []);

  const fetchPlanilla = async () => {
    setLoading(true);
    try {
      // Suponemos que este endpoint ejecuta el stored procedure y devuelve:
      // [
      //   {
      //     idSucursal: 1,
      //     nombreSucursal: "Centro",
      //     empleados: [
      //       {
      //         cedula: 12345678,
      //         nombreCompleto: "Juan Pérez",
      //         tipoPlanilla: "Mensual", // o "Horas" o "Clase"
      //         unidades: 40,            // horas o clases (0 si mensual)
      //         pago: 200000
      //       },
      //       …
      //     ]
      //   },
      //   …
      // ]
      const res = await fetch(`${apiUrl}/Planilla/GeneratePayroll`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const formatted = data.map(branch => ({
        title: branch.nombreSucursal,
        data: branch.empleados
      }));
      setSections(formatted);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo generar la planilla.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.cedula.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.text}><Text style={styles.label}>Cédula:</Text> {item.cedula}</Text>
          <Text style={styles.text}><Text style={styles.label}>Empleado:</Text> {item.nombreCompleto}</Text>
          {item.tipoPlanilla !== 'Mensual' && (
            <Text style={styles.text}>
              <Text style={styles.label}>
                {item.tipoPlanilla === 'Horas' ? 'Horas:' : 'Clases:'}
              </Text>{' '}
              {item.unidades}
            </Text>
          )}
          <Text style={styles.text}><Text style={styles.label}>Pago:</Text> ₡{item.pago}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay datos de planilla.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center:       { flex:1, justifyContent:'center', alignItems:'center' },
  header:       { backgroundColor:'#eee', padding:8, fontWeight:'bold', fontSize:16 },
  item:         { padding:12, borderBottomWidth:1, borderBottomColor:'#ddd' },
  text:         { fontSize:14, marginBottom:4 },
  label:        { fontWeight:'600' },
  empty:        { textAlign:'center', marginTop:20, color:'#666' },
});
