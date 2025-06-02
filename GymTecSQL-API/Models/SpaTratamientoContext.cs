using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class SpaTratamientoContext : DbContext
    {
        public SpaTratamientoContext(DbContextOptions<SpaTratamientoContext> options)
            : base(options)
        {
        }

        public DbSet<SpaTratamiento> SpaTratamiento { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<SpaTratamiento>()
                .HasKey(st => st.Id);

            // Relación con Spa
            modelBuilder.Entity<SpaTratamiento>()
                .HasOne<Spa>()
                .WithMany()
                .HasForeignKey(st => st.IdSpa)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación con Tratamiento
            modelBuilder.Entity<SpaTratamiento>()
                .HasOne<Tratamiento>()
                .WithMany()
                .HasForeignKey(st => st.IdTratamiento)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
