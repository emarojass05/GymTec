using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class PlanillaContext : DbContext
    {
        public PlanillaContext(DbContextOptions<PlanillaContext> options)
            : base(options)
        {
        }

        public DbSet<Planilla> Planilla { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Planilla>()
                .HasKey(p => p.IdPlanilla);
        }
    }
}
