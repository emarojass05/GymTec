using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class ProductoContext : DbContext
    {
        public ProductoContext(DbContextOptions<ProductoContext> options)
            : base(options)
        {
        }

        public DbSet<Producto> Producto { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Producto>()
                .HasKey(p => p.CodigoBarrasProducto);
        }
    }
}
