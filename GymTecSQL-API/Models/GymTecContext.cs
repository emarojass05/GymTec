using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class GymTecContext : DbContext
    {
        public GymTecContext(DbContextOptions<GymTecContext> options)
            : base(options)
        {
        }

        public DbSet<ActividadLaboral> ActividadLaboral { get; set; }
        public DbSet<Clase> Clase { get; set; }
        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Empleado> Empleado { get; set; }
        public DbSet<HorarioSucursal> HorarioSucursal { get; set; }
        public DbSet<Maquina> Maquina { get; set; }
        public DbSet<Planilla> Planilla { get; set; }
        public DbSet<Producto> Producto { get; set; }
        public DbSet<Puesto> Puesto { get; set; }
        public DbSet<Servicio> Servicio { get; set; }
        public DbSet<Spa> Spa { get; set; }
        public DbSet<SpaTratamiento> SpaTratamiento { get; set; }
        public DbSet<Sucursal> Sucursal { get; set; }
        public DbSet<Tienda> Tienda { get; set; }
        public DbSet<TiendaProducto> TiendaProducto { get; set; }
        public DbSet<TipoEquipo> TipoEquipo { get; set; }
        public DbSet<Tratamiento> Tratamiento { get; set; }
    }
}
