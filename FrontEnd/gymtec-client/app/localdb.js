// app/localdb.js
import { Platform } from 'react-native';

let dbInstance = null;

/**
 * Obtiene o abre la instancia de la base de datos en móvil.
 */
async function getDB() {
  if (dbInstance) return dbInstance;

  const SQLite = require('expo-sqlite');
  if (SQLite.openDatabaseAsync) {
    dbInstance = await SQLite.openDatabaseAsync('gymtec.db');
  } else if (SQLite.openDatabaseSync) {
    dbInstance = SQLite.openDatabaseSync('gymtec.db');
  } else {
    console.error('[localdb] ninguna API de apertura disponible:', Object.keys(SQLite));
  }

  return dbInstance;
}

/**
 * Inicializa las tablas locales en iOS/Android.
 */
export async function initLocalDB() {
  if (Platform.OS === 'web') {
    console.log('[localdb] inicialización omitida en web');
    return;
  }

  const db = await getDB();
  if (!db) {
    console.warn('[localdb] no hay instancia de DB, saltando init');
    return;
  }

  const schema = `
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS Cliente (
      CedulaCliente    INTEGER PRIMARY KEY NOT NULL,
      NombreCliente    TEXT    NOT NULL,
      ApellidosCliente TEXT    NOT NULL,
      FechaNacimiento  TEXT    NOT NULL,
      PesoCliente      REAL    NOT NULL,
      IMCCliente       REAL    NOT NULL,
      IdInstructor     INTEGER,
      DireccionCliente TEXT    NOT NULL,
      CorreoCliente    TEXT    NOT NULL,
      PasswordCliente  TEXT    NOT NULL,
      last_modified    TEXT,
      sync_status      TEXT
    );
    CREATE TABLE IF NOT EXISTS Clase (
      IdClase            INTEGER PRIMARY KEY NOT NULL,
      TipoClase          INTEGER NOT NULL,
      IdInstructorClase  INTEGER NOT NULL,
      Grupal             INTEGER NOT NULL,
      CapacidadClase     INTEGER NOT NULL,
      FechaClase         TEXT    NOT NULL,
      HoraInicioClase    TEXT    NOT NULL,
      HoraFinalizacionClase TEXT NOT NULL,
      IdSucursal         INTEGER NOT NULL,
      last_modified      TEXT,
      sync_status        TEXT
    );
    CREATE TABLE IF NOT EXISTS AsistenciaClase (
      IdClase       INTEGER NOT NULL,
      CedulaCliente INTEGER NOT NULL,
      last_modified TEXT,
      sync_status   TEXT,
      PRIMARY KEY (CedulaCliente, IdClase),
      FOREIGN KEY (IdClase)       REFERENCES Clase(IdClase),
      FOREIGN KEY (CedulaCliente) REFERENCES Cliente(CedulaCliente)
    );
  `;

  try {
    if (db.execAsync) {
      await db.execAsync(schema);
    } else if (db.execSync) {
      db.execSync(schema);
    } else {
      for (const stmt of schema.split(';').map(s => s.trim()).filter(Boolean)) {
        await db.runAsync(stmt);
      }
    }
    console.log('✅ Tablas locales Cliente, Clase y AsistenciaClase listas');
  } catch (err) {
    console.error('[localdb] error creando tablas:', err);
  }
}

/**
 * Inserta un nuevo cliente y lo marca 'pending' para sync.
 */
export async function addCliente({
  cedula,
  nombre,
  apellidos,
  fechaNacimiento,
  peso,
  imc,
  idInstructor = null,
  direccion,
  correo,
  password
}) {
  const db = await getDB();
  const now = new Date().toISOString();
  const sql = `
    INSERT INTO Cliente
      (CedulaCliente, NombreCliente, ApellidosCliente, FechaNacimiento,
       PesoCliente, IMCCliente, IdInstructor, DireccionCliente,
       CorreoCliente, PasswordCliente, last_modified, sync_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending');
  `;
  await db.runAsync(sql, [
    cedula, nombre, apellidos, fechaNacimiento,
    peso, imc, idInstructor, direccion, correo, password, now
  ]);
}

/**
 * Actualiza un cliente existente y lo marca 'pending' para sync.
 */
export async function updateCliente({
  cedula,
  nombre,
  apellidos,
  fechaNacimiento,
  peso,
  imc,
  idInstructor = null,
  direccion,
  correo,
  password
}) {
  const db = await getDB();
  const now = new Date().toISOString();
  const sql = `
    UPDATE Cliente SET
      NombreCliente    = ?,
      ApellidosCliente = ?,
      FechaNacimiento  = ?,
      PesoCliente      = ?,
      IMCCliente       = ?,
      IdInstructor     = ?,
      DireccionCliente = ?,
      CorreoCliente    = ?,
      PasswordCliente  = ?,
      last_modified    = ?,
      sync_status      = 'pending'
    WHERE CedulaCliente = ?;
  `;
  await db.runAsync(sql, [
    nombre, apellidos, fechaNacimiento,
    peso, imc, idInstructor, direccion,
    correo, password, now, cedula
  ]);
}

/**
 * Elimina un cliente localmente.
 */
export async function deleteCliente(cedula) {
  const db = await getDB();
  await db.runAsync(
    `DELETE FROM Cliente WHERE CedulaCliente = ?;`,
    [cedula]
  );
}

/**
 * Recupera todos los clientes locales.
 */
export async function fetchClientes() {
  const db = await getDB();
  return await db.getAllAsync(`SELECT * FROM Cliente;`);
}

/**
 * Inserta o actualiza una clase localmente.
 * Si ya existe (mismo IdClase), hace UPDATE, sino INSERT.
 */
export async function upsertClase({
  IdClase,
  TipoClase,
  IdInstructorClase,
  Grupal,
  CapacidadClase,
  FechaClase,
  HoraInicioClase,
  HoraFinalizacionClase,
  IdSucursal,
  lastModified = null,          // opcional: timestamp del server
  syncStatus = 'synced'         // al venir del server, ya sincronizada
}) {
  const db = await getDB();
  const now = new Date().toISOString();
  // Intentar UPDATE primero
  const res = await db.getAllAsync(
    `SELECT 1 FROM Clase WHERE IdClase = ?;`,
    [IdClase]
  );
  if (res.length) {
    // UPDATE
    await db.runAsync(
      `UPDATE Clase SET
         TipoClase = ?, IdInstructorClase = ?, Grupal = ?, 
         CapacidadClase = ?, FechaClase = ?, HoraInicioClase = ?,
         HoraFinalizacionClase = ?, IdSucursal = ?, 
         last_modified = ?, sync_status = ?
       WHERE IdClase = ?;`,
      [
        TipoClase, IdInstructorClase, Grupal,
        CapacidadClase, FechaClase, HoraInicioClase,
        HoraFinalizacionClase, IdSucursal,
        lastModified || now, syncStatus,
        IdClase
      ]
    );
  } else {
    // INSERT
    await db.runAsync(
      `INSERT INTO Clase
         (IdClase, TipoClase, IdInstructorClase, Grupal,
          CapacidadClase, FechaClase, HoraInicioClase,
          HoraFinalizacionClase, IdSucursal,
          last_modified, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        IdClase, TipoClase, IdInstructorClase, Grupal,
        CapacidadClase, FechaClase, HoraInicioClase,
        HoraFinalizacionClase, IdSucursal,
        lastModified || now, syncStatus
      ]
    );
  }
}

/**
 * Recupera todas las clases almacenadas.
 */
export async function fetchClases() {
  const db = await getDB();
  return await db.getAllAsync(`SELECT * FROM Clase;`);
}

/**
 * Registra una asistencia localmente (cuando el usuario se inscribe).
 */
export async function addAsistenciaClase({ IdClase, CedulaCliente }) {
  const db = await getDB();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO AsistenciaClase
       (IdClase, CedulaCliente, last_modified, sync_status)
     VALUES (?, ?, ?, 'pending');`,
    [IdClase, CedulaCliente, now]
  );
}

/**
 * Recupera todas las asistencias.
 */
export async function fetchAsistencias() {
  const db = await getDB();
  return await db.getAllAsync(`SELECT * FROM AsistenciaClase;`);
}