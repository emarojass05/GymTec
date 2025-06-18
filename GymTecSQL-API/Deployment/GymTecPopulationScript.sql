---------------------------------------
-- Población de datos iniciales
---------------------------------------
BEGIN;
-- Estados
INSERT INTO "Estado"("DescripcionEstado") VALUES('Activo'),('Inactivo');

-- Puestos default
INSERT INTO "Puesto"("DescripcionPuesto") VALUES
  ('Administrador'),
  ('Instructor'),
  ('Dependiente Spa'),
  ('Dependiente Tienda');

-- Tratamientos default (no modificables ni eliminables)
INSERT INTO "Tratamiento"("NombreTratamiento") VALUES
  ('Masaje Relajante'),
  ('Masaje Descarga Muscular'),
  ('Sauna'),
  ('Baños a Vapor');

-- Marcas de máquina
INSERT INTO "MarcaMaquina"("NombreMarcaMaquina") VALUES('Life Fitness'),('Technogym');

-- Planillas
INSERT INTO "Planilla"("DescripcionPlanilla") VALUES('Mensual'),('Por Horas'),('Por Clase (Grupal)');

-- Productos
INSERT INTO "Producto"("CodigoBarrasProducto","NombreProducto","DescripcionProducto","CostoProducto") VALUES
  (1001,'Proteína Whey','Suplemento de proteína de suero',25.50),
  (1002,'Esterilla Yoga','Colchoneta antideslizante',15.00);

-- Servicios básicos
INSERT INTO "Servicio"("DescripcionServicio") VALUES
  ('Indoor Cycling'),('Pilates'),('Yoga'),('Zumba'),('Natación');

-- Tipos de equipo básicos
INSERT INTO "TipoEquipo"("DescripcionTipoEquipo") VALUES
  ('Cintas de correr'),('Bicicletas estacionarias'),('Multigimnasios'),('Remos'),('Pesas');

-- Sucursales
INSERT INTO "Sucursal"("DireccionSucursal","FechaApertura","HorarioAtencion") VALUES
  ('San José Centro','2025-01-15 08:00:00-06','08:00-20:00'),
  ('Escazú','2024-09-01 09:00:00-06','07:00-22:00');

-- Clientes de ejemplo
INSERT INTO "Cliente"("CedulaCliente","NombreCliente","ApellidosCliente","FechaNacimiento","PesoCliente","IMCCliente","DireccionCliente","CorreoCliente","PasswordCliente") VALUES
  (100000001,'Juan','Pérez','1990-01-15 00:00:00-06',72.0,24.0,'Av. Central, San José','juan.perez@example.com',md5('1234')),
  (100000002,'María','González','1985-05-30 00:00:00-06',65.0,22.5,'Barrio Tournón, San José','maria.gonzalez@example.com',md5('1234'));

-- Empleados de ejemplo
INSERT INTO "Empleado"("CedulaEmpleado","NombreEmpleado","DireccionEmpleado","IdSucursal","IdPuesto","IdPlanilla","SalarioEmpleado","CorreoEmpleado","PasswordEmpleado") VALUES
  (200000001,'Ana','Av. 2, San José',1,1,1,800.00,'ana@gymtec.cr',md5('admin')),
  (200000002,'Luis','Escazú Centro',2,2,2,600.00,'luis@gymtec.cr',md5('admin'));

-- Spas
INSERT INTO "Spa"("IdSucursal","EstadoSpa") VALUES
  (1,1),(2,1);

-- Spa-Tratamientos asociados
INSERT INTO "SpaTratamiento"("IdSpa","IdTratamiento") VALUES
  (1,1),(1,2),(1,3),(1,4),(2,1),(2,3);

-- Tiendas
INSERT INTO "Tienda"("EstadoTienda","IdSucursal") VALUES
  (1,1),(1,2);

-- Productos en tiendas
INSERT INTO "TiendaProducto"("IdTienda","CodigoBarrasProducto") VALUES
  (1,1001),(1,1002),(2,1001);

-- Servicios por sucursal
INSERT INTO "ServicioSucursal"("IdServicio","IdSucursal") VALUES
  (1,1),(2,1),(3,1),(4,1),(5,1),(3,2),(5,2);

-- Máquinas
INSERT INTO "Maquina"("IdMarcaMaquina","IdSucursal","IdTipoEquipo") VALUES
  (1,1,1),(1,1,3),(2,2,2),(2,2,5);

-- Clases de ejemplo
INSERT INTO "Clase"("TipoClase","IdInstructorClase","Grupal","CapacidadClase","FechaClase","HoraInicioClase","HoraFinalizacionClase","IdSucursal") VALUES
  (1,200000001,true,20,'2025-06-10 00:00:00-06','09:00:00','10:00:00',1),
  (3,200000002,false,5,'2025-06-11 00:00:00-06','18:00:00','19:00:00',2);

-- Asistencia a clases ejemplo
INSERT INTO "AsistenciaClase"("CedulaCliente","IdClase") VALUES
  (100000001,1),(100000002,2);

-- Actividad laboral
INSERT INTO "ActividadLaboral"("Año","Mes","Horas","IdEmpleado") VALUES
  (2025,6,160,200000001),(2025,6,120,200000002);

COMMIT;

---------------------------------------
-- Procedimientos Almacenados (Store Procedures)
---------------------------------------

-- 1) Generación de planilla
CREATE OR REPLACE FUNCTION sp_GenerarPlanilla()
RETURNS TABLE(
  IdSucursal integer,
  CedulaEmpleado integer,
  NombreEmpleado text,
  NumClases integer,
  HorasLaboradas integer,
  MontoPagar numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e."IdSucursal",
    e."CedulaEmpleado",
    e."NombreEmpleado",
    COALESCE(cl.count_clases,0) AS NumClases,
    COALESCE(al.horas,0) AS HorasLaboradas,
    CASE p."DescripcionPlanilla"
      WHEN 'Mensual' THEN e."SalarioEmpleado"
      WHEN 'Por Horas' THEN COALESCE(al.horas,0) * e."SalarioEmpleado"
      WHEN 'Por Clase (Grupal)' THEN COALESCE(cl.count_clases,0) * e."SalarioEmpleado"
      ELSE 0
    END AS MontoPagar
  FROM "Empleado" e
  JOIN "Planilla" p ON e."IdPlanilla"=p."IdPlanilla"
  LEFT JOIN (
    SELECT "IdInstructorClase", COUNT(*) AS count_clases
    FROM "Clase"
    GROUP BY "IdInstructorClase"
  ) cl ON cl."IdInstructorClase"=e."CedulaEmpleado"
  LEFT JOIN (
    SELECT "IdEmpleado", SUM("Horas") AS horas
    FROM "ActividadLaboral"
    GROUP BY "IdEmpleado"
  ) al ON al."IdEmpleado"=e."CedulaEmpleado";
END;
$$ LANGUAGE plpgsql;

-- 2) Copiar calendario de actividades (semana) a otra fecha
CREATE OR REPLACE FUNCTION sp_CopiarCalendarioActividadesSemana(
  fecha_origen date,
  fecha_destino date
) RETURNS void AS $$
BEGIN
  INSERT INTO "Clase"(
    "TipoClase","IdInstructorClase","Grupal","CapacidadClase",
    "FechaClase","HoraInicioClase","HoraFinalizacionClase","IdSucursal"
  )
  SELECT
    "TipoClase","IdInstructorClase","Grupal","CapacidadClase",
    (fecha_destino + (c."FechaClase"::date - fecha_origen))::timestamp,
    c."HoraInicioClase",c."HoraFinalizacionClase",c."IdSucursal"
  FROM "Clase" c
  WHERE c."FechaClase"::date >= fecha_origen
    AND c."FechaClase"::date < fecha_origen + interval '7 days';
END;
$$ LANGUAGE plpgsql;

-- 3) Copiar Gimnasio (tratamientos, productos y clases sin instructor)
CREATE OR REPLACE FUNCTION sp_CopiarGimnasio(
  id_sucursal_origen integer,
  id_sucursal_destino integer
) RETURNS void AS $$
DECLARE
  spa_origen integer;
  spa_destino integer;
  tienda_origen integer;
  tienda_destino integer;
BEGIN
  -- Obtener IdSpa y IdTienda asociados
  SELECT "IdSpa" INTO spa_origen FROM "Spa" WHERE "IdSucursal"=id_sucursal_origen;
  SELECT "IdSpa" INTO spa_destino FROM "Spa" WHERE "IdSucursal"=id_sucursal_destino;
  SELECT "IdTienda" INTO tienda_origen FROM "Tienda" WHERE "IdSucursal"=id_sucursal_origen;
  SELECT "IdTienda" INTO tienda_destino FROM "Tienda" WHERE "IdSucursal"=id_sucursal_destino;

  -- Copiar tratamientos al nuevo Spa
  INSERT INTO "SpaTratamiento"("IdSpa","IdTratamiento")
    SELECT spa_destino, st."IdTratamiento"
    FROM "SpaTratamiento" st
    WHERE st."IdSpa"=spa_origen;

  -- Copiar productos a la nueva Tienda
  INSERT INTO "TiendaProducto"("IdTienda","CodigoBarrasProducto")
    SELECT tienda_destino, tp."CodigoBarrasProducto"
    FROM "TiendaProducto" tp
    WHERE tp."IdTienda"=tienda_origen;

  -- Copiar clases sin asignar instructor
  INSERT INTO "Clase"(
    "TipoClase","IdInstructorClase","Grupal","CapacidadClase",
    "FechaClase","HoraInicioClase","HoraFinalizacionClase","IdSucursal"
  )
    SELECT c."TipoClase", NULL, c."Grupal", c."CapacidadClase",
      c."FechaClase", c."HoraInicioClase", c."HoraFinalizacionClase", id_sucursal_destino
    FROM "Clase" c
    WHERE c."IdSucursal"=id_sucursal_origen;
END;
$$ LANGUAGE plpgsql;

-- 4) Registrar asistencia en clase (valida cupo)
CREATE OR REPLACE FUNCTION sp_RegistrarAsistenciaClase(
  cedula_cliente integer,
  id_clase integer
) RETURNS void AS $$
DECLARE
  capacidad integer;
  inscritos integer;
BEGIN
  SELECT "CapacidadClase" INTO capacidad FROM "Clase" WHERE "IdClase"=id_clase;
  SELECT COUNT(*) INTO inscritos FROM "AsistenciaClase" WHERE "IdClase"=id_clase;
  IF inscritos >= capacidad THEN
    RAISE EXCEPTION 'La clase % está llena', id_clase;
  END IF;
  INSERT INTO "AsistenciaClase"("CedulaCliente","IdClase") VALUES(cedula_cliente,id_clase);
END;
$$ LANGUAGE plpgsql;

---------------------------------------
-- Triggers y funciones auxiliares
---------------------------------------

-- 1) Evitar modificación de tratamientos default
CREATE OR REPLACE FUNCTION trg_no_modificar_tratamiento_default() RETURNS trigger AS $$
BEGIN
  IF OLD."NombreTratamiento" IN ('Masaje Relajante','Masaje Descarga Muscular','Sauna','Baños a Vapor') THEN
    RAISE EXCEPTION 'No se puede modificar el tratamiento default %', OLD."NombreTratamiento";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_update_default_tratamientos
BEFORE UPDATE ON "Tratamiento"
FOR EACH ROW EXECUTE FUNCTION trg_no_modificar_tratamiento_default();

-- 2) Evitar eliminación de tratamientos default o asociados
CREATE OR REPLACE FUNCTION trg_no_eliminar_tratamiento() RETURNS trigger AS $$
BEGIN
  IF OLD."NombreTratamiento" IN ('Masaje Relajante','Masaje Descarga Muscular','Sauna','Baños a Vapor')
    OR EXISTS(SELECT 1 FROM "SpaTratamiento" WHERE "IdTratamiento"=OLD."IdTratamiento") THEN
    RAISE EXCEPTION 'No se puede eliminar el tratamiento %', OLD."NombreTratamiento";
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_delete_tratamientos
BEFORE DELETE ON "Tratamiento"
FOR EACH ROW EXECUTE FUNCTION trg_no_eliminar_tratamiento();

-- 3) Evitar eliminación de puestos default
CREATE OR REPLACE FUNCTION trg_no_eliminar_puesto_default() RETURNS trigger AS $$
BEGIN
  IF OLD."DescripcionPuesto" IN ('Administrador','Instructor','Dependiente Spa','Dependiente Tienda') THEN
    RAISE EXCEPTION 'No se puede eliminar el puesto default %', OLD."DescripcionPuesto";
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_delete_puestos_default
BEFORE DELETE ON "Puesto"
FOR EACH ROW EXECUTE FUNCTION trg_no_eliminar_puesto_default();

---------------------------------------
-- Vistas
---------------------------------------

-- 1) Clases con cupos disponibles
CREATE OR REPLACE VIEW vw_ClasesDisponibles AS
SELECT
  c."IdClase",
  c."TipoClase",
  c."FechaClase",
  c."HoraInicioClase",
  c."HoraFinalizacionClase",
  c."CapacidadClase" - COUNT(a."CedulaCliente") AS cupos_disponibles
FROM "Clase" c
LEFT JOIN "AsistenciaClase" a ON c."IdClase"=a."IdClase"
GROUP BY c."IdClase",c."TipoClase",c."FechaClase",c."HoraInicioClase",c."HoraFinalizacionClase",c."CapacidadClase";

-- 2) Empleados y su tipo de planilla por sucursal
CREATE OR REPLACE VIEW vw_EmpleadosPorSucursal AS
SELECT
  e."CedulaEmpleado",
  e."NombreEmpleado",
  e."IdSucursal",
  p."DescripcionPlanilla"
FROM "Empleado" e
JOIN "Planilla" p ON e."IdPlanilla"=p."IdPlanilla";
