import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClasesScreen from './screens/ClasesScreenCliente';
import HomeScreen from './screens/HomeScreenCliente';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreenCliente';
import PlanScreen from './screens/PlanScreenCliente';
import RegisterScreen from './screens/RegisterScreenCliente';

// Import de pantallas de instructor
import ClasesInstructor from './screens/ClasesInstructor';
import ClientesInstructor from './screens/ClientesInstructor';
import EditClaseInstructor from './screens/EditClaseInstructor';
import HomeScreenInstructor from './screens/HomeScreenInstructor';
import PlanesInstructor from './screens/PlanesInstructor';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Cliente */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Clases" component={ClasesScreen} />
      <Stack.Screen name="Plan" component={PlanScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />

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

    </Stack.Navigator>
  );
}
