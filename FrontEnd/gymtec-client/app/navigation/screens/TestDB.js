// app/navigation/screens/TestDB.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
// Ajuste de la ruta: subir dos niveles desde navigation/screens hasta la carpeta app
import {
  addCliente,
  fetchClientes,
  deleteCliente
} from '../../localdb';

export default function TestDB() {
  const [clientes, setClientes] = useState([]);

  const load = async () => {
    const all = await fetchClientes();
    console.log('📋 Clientes en DB:', all);
    setClientes(all);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button
        title="➕ Agregar cliente de prueba"
        onPress={async () => {
          await addCliente({
            cedula: Math.floor(Math.random() * 1e8),
            nombre: 'Test',
            apellidos: 'Usuario',
            fechaNacimiento: '2000-01-01',
            peso: 70,
            imc: 22,
            direccion: 'Calle Falsa 123',
            correo: 'test@local.com',
            password: '1234'
          });
          await load();
        }}
      />

      {clientes.map(c => (
        <View
          key={c.CedulaCliente.toString()}
          style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 4 }}
        >
          <Text>{c.NombreCliente} {c.ApellidosCliente}</Text>
          <Text>CI: {c.CedulaCliente}</Text>
          <Button
            title="🗑 Borrar"
            onPress={async () => {
              await deleteCliente(c.CedulaCliente);
              await load();
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
