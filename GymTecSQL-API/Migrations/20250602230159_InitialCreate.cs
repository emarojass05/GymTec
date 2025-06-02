using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymTecSQL_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActividadLaboral",
                columns: table => new
                {
                    IdActividadLaboral = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Año = table.Column<int>(type: "int", nullable: false),
                    Mes = table.Column<int>(type: "int", nullable: false),
                    Horas = table.Column<int>(type: "int", nullable: false),
                    IdClase = table.Column<int>(type: "int", nullable: false),
                    IdEmpleado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadLaboral", x => x.IdActividadLaboral);
                });

            migrationBuilder.CreateTable(
                name: "Clase",
                columns: table => new
                {
                    IdClase = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoClase = table.Column<int>(type: "int", nullable: false),
                    InstructorClase = table.Column<int>(type: "int", nullable: false),
                    ModalidadClase = table.Column<int>(type: "int", nullable: false),
                    CapacidadClase = table.Column<int>(type: "int", nullable: false),
                    FechaClase = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HoraInicioClase = table.Column<TimeOnly>(type: "time", nullable: false),
                    HoraFinalizacionClase = table.Column<TimeOnly>(type: "time", nullable: false),
                    IdSucursal = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clase", x => x.IdClase);
                });

            migrationBuilder.CreateTable(
                name: "Cliente",
                columns: table => new
                {
                    CedulaCliente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreCliente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApellidosCliente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PesoCliente = table.Column<double>(type: "float", nullable: false),
                    IMCCliente = table.Column<double>(type: "float", nullable: false),
                    DireccionCliente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorreoCliente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordCliente = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cliente", x => x.CedulaCliente);
                });

            migrationBuilder.CreateTable(
                name: "Empleado",
                columns: table => new
                {
                    CedulaEmpleado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreEmpleado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DireccionEmpleado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdSucursal = table.Column<int>(type: "int", nullable: false),
                    IdPuesto = table.Column<int>(type: "int", nullable: false),
                    IdPlanilla = table.Column<int>(type: "int", nullable: false),
                    SalarioEmpleado = table.Column<double>(type: "float", nullable: false),
                    CorreoEmpleado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordEmpleado = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empleado", x => x.CedulaEmpleado);
                });

            migrationBuilder.CreateTable(
                name: "HorarioSucursal",
                columns: table => new
                {
                    IdHorario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSucursal = table.Column<int>(type: "int", nullable: false),
                    DiaSemana = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HoraApertura = table.Column<TimeOnly>(type: "time", nullable: false),
                    HoraCierre = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorarioSucursal", x => x.IdHorario);
                });

            migrationBuilder.CreateTable(
                name: "Maquina",
                columns: table => new
                {
                    IdMaquina = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MarcaMaquina = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdSucursal = table.Column<int>(type: "int", nullable: false),
                    IdTipoEquipo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maquina", x => x.IdMaquina);
                });

            migrationBuilder.CreateTable(
                name: "Planilla",
                columns: table => new
                {
                    IdPlanilla = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DescripcionPlanilla = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planilla", x => x.IdPlanilla);
                });

            migrationBuilder.CreateTable(
                name: "Producto",
                columns: table => new
                {
                    CodigoBarrasProducto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreProducto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescripcionProducto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CostoProducto = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Producto", x => x.CodigoBarrasProducto);
                });

            migrationBuilder.CreateTable(
                name: "Puesto",
                columns: table => new
                {
                    IdPuesto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DescripcionPuesto = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Puesto", x => x.IdPuesto);
                });

            migrationBuilder.CreateTable(
                name: "Servicio",
                columns: table => new
                {
                    IdServicio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DescripcionServicio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdSucursal = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servicio", x => x.IdServicio);
                });

            migrationBuilder.CreateTable(
                name: "Spa",
                columns: table => new
                {
                    IdSpa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstadoSpa = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spa", x => x.IdSpa);
                });

            migrationBuilder.CreateTable(
                name: "SpaTratamiento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSpa = table.Column<int>(type: "int", nullable: false),
                    IdTratamiento = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpaTratamiento", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sucursal",
                columns: table => new
                {
                    IdSucursal = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DireccionSucursal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaApertura = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HorarioAtencion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdSpa = table.Column<int>(type: "int", nullable: false),
                    IdTienda = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sucursal", x => x.IdSucursal);
                });

            migrationBuilder.CreateTable(
                name: "Tienda",
                columns: table => new
                {
                    IdTienda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstadoTienda = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tienda", x => x.IdTienda);
                });

            migrationBuilder.CreateTable(
                name: "TiendaProducto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdTienda = table.Column<int>(type: "int", nullable: false),
                    CodigoBarrasProducto = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiendaProducto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoEquipo",
                columns: table => new
                {
                    IdTipoEquipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DescripcionTipoEquipo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoEquipo", x => x.IdTipoEquipo);
                });

            migrationBuilder.CreateTable(
                name: "Tratamiento",
                columns: table => new
                {
                    IdTratamiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreTratamiento = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tratamiento", x => x.IdTratamiento);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActividadLaboral");

            migrationBuilder.DropTable(
                name: "Clase");

            migrationBuilder.DropTable(
                name: "Cliente");

            migrationBuilder.DropTable(
                name: "Empleado");

            migrationBuilder.DropTable(
                name: "HorarioSucursal");

            migrationBuilder.DropTable(
                name: "Maquina");

            migrationBuilder.DropTable(
                name: "Planilla");

            migrationBuilder.DropTable(
                name: "Producto");

            migrationBuilder.DropTable(
                name: "Puesto");

            migrationBuilder.DropTable(
                name: "Servicio");

            migrationBuilder.DropTable(
                name: "Spa");

            migrationBuilder.DropTable(
                name: "SpaTratamiento");

            migrationBuilder.DropTable(
                name: "Sucursal");

            migrationBuilder.DropTable(
                name: "Tienda");

            migrationBuilder.DropTable(
                name: "TiendaProducto");

            migrationBuilder.DropTable(
                name: "TipoEquipo");

            migrationBuilder.DropTable(
                name: "Tratamiento");
        }
    }
}
