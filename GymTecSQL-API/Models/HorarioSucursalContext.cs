using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class HorarioSucursalContext : DbContext
    {
        public HorarioSucursalContext(DbContextOptions<HorarioSucursalContext> options)
            : base(options)
        {
        }

        public DbSet<HorarioSucursal> HorarioSucursal { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<HorarioSucursal>()
                .HasKey(h => h.IdHorario);

            // Relación con Sucursal
            modelBuilder.Entity<HorarioSucursal>()
                .HasOne<Sucursal>()
                .WithMany()
                .HasForeignKey(h => h.IdSucursal)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
