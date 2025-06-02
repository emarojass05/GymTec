using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class MaquinaContext : DbContext
    {
        public MaquinaContext(DbContextOptions<MaquinaContext> options)
            : base(options)
        {
        }

        public DbSet<Maquina> Maquina { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Maquina>()
                .HasKey(m => m.IdMaquina);

            // Relación con Sucursal
            modelBuilder.Entity<Maquina>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(m => m.IdSucursal)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación con TipoEquipo
            modelBuilder.Entity<Maquina>()
                .HasOne<TipoEquipo>()
                .WithMany()
                .HasForeignKey(m => m.IdTipoEquipo)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
