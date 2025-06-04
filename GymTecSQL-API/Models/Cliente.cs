using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymTecSQL_API.Models
{
    public class Cliente
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int CedulaCliente { get; set; }

        public required string NombreCliente { get; set; }

        public required string ApellidosCliente { get; set; }

        public required DateTime FechaNacimiento { get; set; }

        public required double PesoCliente { get; set; }

        public required double IMCCliente { get; set; }

        public required string DireccionCliente { get; set; }

        public required string CorreoCliente { get; set; }

        public required string PasswordCliente { get; set; }
    }
}
