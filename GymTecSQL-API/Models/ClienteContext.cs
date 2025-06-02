using Microsoft.EntityFrameworkCore;

namespace GymTecSQL_API.Models
{
    public class ClienteContext : DbContext
    {
        public ClienteContext(DbContextOptions<ClienteContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Cliente { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave primaria
            modelBuilder.Entity<Cliente>()
                .HasKey(c => c.CedulaCliente);
        }
    }
}
