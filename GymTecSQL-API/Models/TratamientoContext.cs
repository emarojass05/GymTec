using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class TratamientoContext : DbContext
    {
        public TratamientoContext(DbContextOptions<TratamientoContext> options)
            : base(options)
        {
        }

        public DbSet<Tratamiento> Tratamiento { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Tratamiento>()
                .HasKey(t => t.IdTratamiento);
        }
    }
}
