using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class TipoEquipoContext : DbContext
    {
        public TipoEquipoContext(DbContextOptions<TipoEquipoContext> options)
            : base(options)
        {
        }

        public DbSet<TipoEquipo> TipoEquipo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<TipoEquipo>()
                .HasKey(t => t.IdTipoEquipo);
        }
    }
}
