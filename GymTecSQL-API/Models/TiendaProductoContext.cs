using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class TiendaProductoContext : DbContext
    {
        public TiendaProductoContext(DbContextOptions<TiendaProductoContext> options)
            : base(options)
        {
        }

        public DbSet<TiendaProducto> TiendaProducto { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<TiendaProducto>()
                .HasKey(tp => tp.Id);

            // Relación con Tienda
            modelBuilder.Entity<TiendaProducto>()
                .HasOne<Tienda>()
                .WithMany()
                .HasForeignKey(tp => tp.IdTienda)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación con Producto
            modelBuilder.Entity<TiendaProducto>()
                .HasOne<Producto>()
                .WithMany()
                .HasForeignKey(tp => tp.CodigoBarrasProducto)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
