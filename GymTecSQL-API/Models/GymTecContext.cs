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
        public DbSet<MarcaMaquina> MarcaMaquina { get; set; }
        public DbSet<ServicioSucursal> ServicioSucursal { get; set; }
        public DbSet<Estado> Estado { get; set; }
        public DbSet<AsistenciaClase> AsistenciaClase { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- ActividadLaboral
            // Clave primaria
            modelBuilder.Entity<ActividadLaboral>()
                .HasKey(a => a.IdActividadLaboral);

            // Llaves foráneas
            modelBuilder.Entity<ActividadLaboral>()
                .HasOne<Empleado>()
                .WithMany()
                .HasForeignKey(a => a.IdEmpleado)
                .OnDelete(DeleteBehavior.Cascade);

            // --- AsistenciaClase
            // Clave primaria
            modelBuilder.Entity<AsistenciaClase>()
                .HasKey(ac => new { ac.CedulaCliente, ac.IdClase });

            // --- Clase
            // Clave primaria
            modelBuilder.Entity<Clase>()
                .HasKey(c => c.IdClase);

            // Llave foránea a Sucursal
            modelBuilder.Entity<Clase>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(c => c.IdSucursal)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Cliente
            // Clave primaria
            modelBuilder.Entity<Cliente>()
                .HasKey(c => c.CedulaCliente);

            // --- Empleado
            // Clave primaria
            modelBuilder.Entity<Empleado>()
                .HasKey(e => e.CedulaEmpleado);

            // Relaciones
            modelBuilder.Entity<Empleado>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(e => e.IdSucursal)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Empleado>()
                .HasOne<Puesto>()
                .WithMany()
                .HasForeignKey(e => e.IdPuesto)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Empleado>()
                .HasOne<Planilla>()
                .WithMany()
                .HasForeignKey(e => e.IdPlanilla)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Estado
            // Clave primaria
            modelBuilder.Entity<Estado>()
                .HasKey(e => e.IdEstado);

            // --- Maquina
            // Clave primaria
            modelBuilder.Entity<Maquina>()
                .HasKey(m => m.IdMaquina);

            // Relación con Sucursal
            modelBuilder.Entity<Maquina>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(m => m.IdSucursal)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación con TipoEquipo
            modelBuilder.Entity<Maquina>()
                .HasOne<TipoEquipo>()
                .WithMany()
                .HasForeignKey(m => m.IdTipoEquipo)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación con MarcaMaquina
            modelBuilder.Entity<Maquina>()
                .HasOne<MarcaMaquina>()
                .WithMany()
                .HasForeignKey(m => m.IdMarcaMaquina)
                .OnDelete(DeleteBehavior.Restrict);

            // --- MarcaMaquina
            // Clave primaria
            modelBuilder.Entity<MarcaMaquina>()
                .HasKey(m => m.IdMarcaMaquina);

            // --- Planilla
            // Clave primaria
            modelBuilder.Entity<Planilla>()
                .HasKey(p => p.IdPlanilla);

            // --- Producto
            // Clave primaria
            modelBuilder.Entity<Producto>()
                .HasKey(p => p.CodigoBarrasProducto);

            // --- Puesto
            // Clave primaria
            modelBuilder.Entity<Puesto>()
                .HasKey(p => p.IdPuesto);

            // --- Servivio
            // Clave primaria
            modelBuilder.Entity<Servicio>()
                .HasKey(s => s.IdServicio);

            // --- ServicioSucursal
            // Clave primaria
            modelBuilder.Entity<ServicioSucursal>()
                .HasKey(ss => new { ss.IdServicio, ss.IdSucursal });

            // --- Spa
            // Clave primaria
            modelBuilder.Entity<Spa>()
                .HasKey(s => s.IdSpa);

            // Estado del spa
            modelBuilder.Entity<Spa>()
                .HasOne<Estado>()
                .WithMany()
                .HasForeignKey(s => s.EstadoSpa)
                .OnDelete(DeleteBehavior.Restrict);

            // Sucursal del spa
            modelBuilder.Entity<Spa>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(s => s.IdSucursal)
                .OnDelete(DeleteBehavior.Restrict);

            // --- SpaTratamiento
            // Clave primaria
            modelBuilder.Entity<SpaTratamiento>()
                .HasKey(st => new { st.IdSpa, st.IdTratamiento });

            // --- Sucursal
            // Clave primaria
            modelBuilder.Entity<Sucursal>()
                .HasKey(s => s.IdSucursal);

            // --- Tienda
            // Clave primaria
            modelBuilder.Entity<Tienda>()
                .HasKey(t => t.IdTienda);

            // Foreign keys
            modelBuilder.Entity<Tienda>()
                .HasOne<Estado>()
                .WithMany()
                .HasForeignKey(t => t.EstadoTienda)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Tienda>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(t => t.IdSucursal)
                .OnDelete(DeleteBehavior.Restrict);

            // --- TiendaProducto
            // Clave primaria
            modelBuilder.Entity<TiendaProducto>()
                .HasKey(tp => new { tp.IdTienda, tp.CodigoBarrasProducto });

            // --- TipoEquipo
            // Clave primaria
            modelBuilder.Entity<TipoEquipo>()
                .HasKey(t => t.IdTipoEquipo);

            // --- Tratamiento
            // Clave primaria
            modelBuilder.Entity<Tratamiento>()
                .HasKey(t => t.IdTratamiento);
        }

    }
}
