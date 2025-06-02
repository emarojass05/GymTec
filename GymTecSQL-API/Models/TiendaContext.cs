using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class TiendaContext : DbContext
    {
        public TiendaContext(DbContextOptions<TiendaContext> options)
            : base(options)
        {
        }

        public DbSet<Tienda> Tienda { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Tienda>()
                .HasKey(t => t.IdTienda);
        }
    }
}
