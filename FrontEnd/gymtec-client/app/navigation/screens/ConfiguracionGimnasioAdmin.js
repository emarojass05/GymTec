import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

export default function ConfiguracionGimnasioAdmin({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuración de Gimnasio</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SpaTratamientosAdmin')}
      >
        <Text style={styles.cardTitle}>Asociación Tratamientos al SPA</Text>
        <Text style={styles.cardDesc}>
          Ver/editar qué tratamientos están asociados a cada SPA
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductosAdmin')}
      >
        <Text style={styles.cardTitle}>Asociación Productos a la Tienda</Text>
        <Text style={styles.cardDesc}>
          Ver/editar qué productos se ofrecen en cada tienda
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('InventarioAdmin')}
      >
        <Text style={styles.cardTitle}>Asociación de Inventario</Text>
        <Text style={styles.cardDesc}>
          Ver/editar qué máquinas están asignadas a cada sucursal
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CrearClasesAdmin')}
      >
        <Text style={styles.cardTitle}>Crear / Gestionar Clases</Text>
        <Text style={styles.cardDesc}>
          Dar de alta y editar las clases del gimnasio
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 14,
    color: '#555'
  }
});
