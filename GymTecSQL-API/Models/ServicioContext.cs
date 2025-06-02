using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class ServicioContext : DbContext
    {
        public ServicioContext(DbContextOptions<ServicioContext> options)
            : base(options)
        {
        }

        public DbSet<Servicio> Servicio { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Servicio>()
                .HasKey(s => s.IdServicio);

            // Relación con Sucursal
            modelBuilder.Entity<Servicio>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(s => s.IdSucursal)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
