using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class PuestoContext : DbContext
    {
        public PuestoContext(DbContextOptions<PuestoContext> options)
            : base(options)
        {
        }

        public DbSet<Puesto> Puesto { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Puesto>()
                .HasKey(p => p.IdPuesto);
        }
    }
}
