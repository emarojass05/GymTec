using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class SpaContext : DbContext
    {
        public SpaContext(DbContextOptions<SpaContext> options)
            : base(options)
        {
        }

        public DbSet<Spa> Spa { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Spa>()
                .HasKey(s => s.IdSpa);
        }
    }
}
