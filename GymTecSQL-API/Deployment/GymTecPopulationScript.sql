---------------------------------------
-- Población de datos iniciales necesarios y master data
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

-- Tratamientos default
INSERT INTO "Tratamiento"("NombreTratamiento") VALUES
  ('Masaje Relajante'),
  ('Masaje Descarga Muscular'),
  ('Sauna'),
  ('Baños a Vapor');

-- Planillas
INSERT INTO "Planilla"("DescripcionPlanilla") VALUES('Mensual'),('Por Horas'),('Por Clase');

-- Servicios básicos
INSERT INTO "Servicio"("DescripcionServicio") VALUES
  ('Indoor Cycling'),('Pilates'),('Yoga'),('Zumba'),('Natación');

-- Tipos de equipo básicos
INSERT INTO "TipoEquipo"("DescripcionTipoEquipo") VALUES
  ('Cintas de correr'),('Bicicletas estacionarias'),('Multigimnasios'),('Remos'),('Pesas');

-- Sucursales
INSERT INTO "Sucursal"("DireccionSucursal","FechaApertura","HorarioAtencion") VALUES
  ('Campus Tecnológico Central Cartago','2025-01-15 08:00:00-06','{"L":"05:00-22:00","K":"05:00-22:00","M":"05:00-22:00","J":"05:00-22:00","V":"05:00-22:00","S":"08:00-14:00","D":"09:00-12:00"}'),
  ('Campus Tecnológico San José','2025-01-15 08:00:00-06','{"L":"05:00-22:00","K":"05:00-22:00","M":"05:00-22:00","J":"05:00-22:00","V":"05:00-22:00","S":"08:00-14:00","D":"09:00-12:00"}'),
  ('Campus Tecnológico Alajuela','2025-01-15 08:00:00-06','{"L":"05:00-22:00","K":"05:00-22:00","M":"05:00-22:00","J":"05:00-22:00","V":"05:00-22:00","S":"08:00-14:00","D":"09:00-12:00"}');

-- Administrador principal
INSERT INTO "Empleado"("CedulaEmpleado","NombreEmpleado","DireccionEmpleado","IdSucursal","IdPuesto","IdPlanilla","SalarioEmpleado","CorreoEmpleado","PasswordEmpleado") VALUES
  (303570433,'Armando Morales Obregón','Dulce Nombre, Cartago.',1,1,2,3000.00,'armorales@gymtec.cr',md5('armorales1234'));

-- Spas
INSERT INTO "Spa"("IdSucursal","EstadoSpa") VALUES
  (1,2),(2,2),(3,2);

-- Tiendas
INSERT INTO "Tienda"("EstadoTienda","IdSucursal") VALUES
  (2,1),(2,2),(2,3);

-- Servicios por sucursal
INSERT INTO "ServicioSucursal"("IdServicio","IdSucursal") VALUES
  (1,1),(2,1),(3,1),(4,1),
  (1,2),(2,2),(3,2),(4,2),
  (1,3),(2,3),(3,3),(4,3);

COMMIT;