using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class EmpleadoContext : DbContext
    {
        public EmpleadoContext(DbContextOptions<EmpleadoContext> options)
            : base(options)
        {
        }

        public DbSet<Empleado> Empleado { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
        }
    }
}
