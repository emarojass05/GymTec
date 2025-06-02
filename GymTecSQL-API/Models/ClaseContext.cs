using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class ClaseContext : DbContext
    {
        public ClaseContext(DbContextOptions<ClaseContext> options)
            : base(options)
        {
        }

        public DbSet<Clase> Clase { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Clase>()
                .HasKey(c => c.IdClase);

            // Llave foránea a Sucursal
            modelBuilder.Entity<Clase>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(c => c.IdSucursal)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
