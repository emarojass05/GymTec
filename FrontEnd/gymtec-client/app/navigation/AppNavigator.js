// app/navigation/AppNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClasesScreen from './screens/ClasesScreenCliente';
import HomeScreen from './screens/HomeScreenCliente';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreenCliente';
import PlanScreen from './screens/PlanScreenCliente';
import RegisterScreen from './screens/RegisterScreenCliente';

import TestDB from './screens/TestDB';  // ← Import agregado para prueba de BD local

// Instructor
import ClasesInstructor from './screens/ClasesInstructor';
import ClientesInstructor from './screens/ClientesInstructor';
import EditClaseInstructor from './screens/EditClaseInstructor';
import HomeScreenInstructor from './screens/HomeScreenInstructor';
import PlanesInstructor from './screens/PlanesInstructor';

// Administrador
import CalendarioAdmin from './screens/CalendarioAdmin';
import ConfiguracionGimnasioAdmin from './screens/ConfiguracionGimnasioAdmin';
import CrearClasesAdmin from './screens/CrearClasesAdmin';
import EmpleadosAdmin from './screens/EmpleadosAdmin';
import GeneracionPlanillaAdmin from './screens/GeneracionPlanillaAdmin';
import GimnasiosAdmin from './screens/GimnasiosAdmin';
import HomePageAdmin from './screens/HomePageAdmin';
import InventarioAdmin from './screens/InventarioAdmin';
import PlanillasAdmin from './screens/PlanillasAdmin';
import ProductosAdmin from './screens/ProductosAdmin';
import PuestosAdmin from './screens/PuestosAdmin';
import ServiciosAdmin from './screens/ServiciosAdmin';
import SpaTratamientosAdmin from './screens/SpaTratamientosAdmin';
import SucursalDetailAdmin from './screens/SucursalDetailAdmin';
import SucursalesAdmin from './screens/SucursalesAdmin';
import TiposEquipoAdmin from './screens/TiposEquipoAdmin';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    //<Stack.Navigator initialRouteName="Login">
     <Stack.Navigator initialRouteName="TestDB">
      {/* Login / Registro */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Cliente */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Clases" component={ClasesScreen} />
      <Stack.Screen name="Plan" component={PlanScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />

      {/* Prueba DB Local */}
      <Stack.Screen
        name="TestDB"
        component={TestDB}
        options={{ title: 'Test BD Local' }}
      />

      {/* Instructor */}
      <Stack.Screen
        name="HomeInstructor"
        component={HomeScreenInstructor}
        options={{ title: 'Panel de Instructor' }}
      />
      <Stack.Screen
        name="ClientesInstructor"
        component={ClientesInstructor}
        options={{ title: 'Lista de Clientes' }}
      />
      <Stack.Screen
        name="PlanesInstructor"
        component={PlanesInstructor}
        options={{ title: 'Planes de Trabajo' }}
      />
      <Stack.Screen
        name="ClasesInstructor"
        component={ClasesInstructor}
        options={{ title: 'Clases' }}
      />
      <Stack.Screen
        name="EditClaseInstructor"
        component={EditClaseInstructor}
        options={{ title: 'Editar Clase' }}
      />

      {/* Administrador */}
      <Stack.Screen
        name="HomePageAdmin"
        component={HomePageAdmin}
        options={{ title: 'Panel Administrador' }}
      />
      <Stack.Screen
        name="SucursalesAdmin"
        component={SucursalesAdmin}
        options={{ title: 'Sucursales' }}
      />
      <Stack.Screen
        name="SucursalDetailAdmin"
        component={SucursalDetailAdmin}
        options={{ title: 'Personalizar Sucursal' }}
      />
      <Stack.Screen
        name="SpaTratamientosAdmin"
        component={SpaTratamientosAdmin}
        options={{ title: 'Tratamientos de Spa' }}
      />
      <Stack.Screen
        name="PuestosAdmin"
        component={PuestosAdmin}
        options={{ title: 'Puestos' }}
      />
      <Stack.Screen
        name="PlanillasAdmin"
        component={PlanillasAdmin}
        options={{ title: 'Plantillas' }}
      />
      <Stack.Screen
        name="EmpleadosAdmin"
        component={EmpleadosAdmin}
        options={{ title: 'Empleados' }}
      />
      <Stack.Screen
        name="ServiciosAdmin"
        component={ServiciosAdmin}
        options={{ title: 'Servicios' }}
      />
      <Stack.Screen
        name="TiposEquipoAdmin"
        component={TiposEquipoAdmin}
        options={{ title: 'Tipos de Equipo' }}
      />
      <Stack.Screen
        name="InventarioAdmin"
        component={InventarioAdmin}
        options={{ title: 'Inventario' }}
      />
      <Stack.Screen
        name="ProductosAdmin"
        component={ProductosAdmin}
        options={{ title: 'Productos' }}
      />
      <Stack.Screen
        name="ConfiguracionGimnasioAdmin"
        component={ConfiguracionGimnasioAdmin}
        options={{ title: 'Configuración Gimnasio' }}
      />
      <Stack.Screen
        name="CrearClasesAdmin"
        component={CrearClasesAdmin}
        options={{ title: 'Crear / Gestionar Clases' }}
      />
      <Stack.Screen
        name="GeneracionPlanillaAdmin"
        component={GeneracionPlanillaAdmin}
        options={{ title: 'Generación de Planilla' }}
      />
      <Stack.Screen
        name="CalendarioAdmin"
        component={CalendarioAdmin}
        options={{ title: 'Calendario' }}
      />
      <Stack.Screen
        name="GimnasiosAdmin"
        component={GimnasiosAdmin}
        options={{ title: 'Gimnasios' }}
      />
    </Stack.Navigator>
  );
}
