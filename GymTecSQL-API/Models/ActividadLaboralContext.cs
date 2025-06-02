using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class ActividadLaboralContext : DbContext
    {
        public ActividadLaboralContext(DbContextOptions<ActividadLaboralContext> options)
            : base(options)
        {
        }

        public DbSet<ActividadLaboral> ActividadLaboral { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<ActividadLaboral>()
                .HasKey(a => a.IdActividadLaboral);

            // Llaves foráneas
            modelBuilder.Entity<ActividadLaboral>()
                .HasOne<Clase>()
                .WithMany()
                .HasForeignKey(a => a.IdClase)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ActividadLaboral>()
                .HasOne<Empleado>()
                .WithMany()
                .HasForeignKey(a => a.IdEmpleado)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
