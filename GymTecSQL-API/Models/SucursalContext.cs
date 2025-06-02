using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class SucursalContext : DbContext
    {
        public SucursalContext(DbContextOptions<SucursalContext> options)
            : base(options)
        {
        }

        public DbSet<Sucursal> Sucursal { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Sucursal>()
                .HasKey(s => s.IdSucursal);

            // Relación con Spa
            modelBuilder.Entity<Sucursal>()
                .HasOne<Spa>()
                .WithMany()
                .HasForeignKey(s => s.IdSpa)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación con Tienda
            modelBuilder.Entity<Sucursal>()
                .HasOne<Tienda>()
                .WithMany()
                .HasForeignKey(s => s.IdTienda)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
