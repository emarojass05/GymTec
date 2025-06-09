import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomePageAdmin({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel Administrador</Text>
      {[
        ['Sucursales', 'SucursalesAdmin'],
        ['Tratamientos de Spa', 'SpaTratamientosAdmin'],
        ['Puestos', 'PuestosAdmin'],
        ['Plantillas', 'PlanillasAdmin'],
        ['Empleados', 'EmpleadosAdmin'],
        ['Servicios', 'ServiciosAdmin'],
        ['Tipos Equipo', 'TiposEquipoAdmin'],
        ['Inventario', 'InventarioAdmin'],
        ['Productos', 'ProductosAdmin'],
        ['Configuración Gimnasio', 'ConfiguracionGimnasioAdmin'],
        ['Generación de planilla', 'GeneracionPlanillaAdmin'],
        ['Calendario', 'CalendarioAdmin'],
        ['Gimnasios', 'GimnasiosAdmin'],
      ].map(([label, screen]) => (
        <TouchableOpacity
          key={screen}
          style={styles.button}
          onPress={() => navigation.navigate(screen)}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
