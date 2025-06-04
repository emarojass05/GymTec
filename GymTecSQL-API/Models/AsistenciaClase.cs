using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class AsistenciaClase
    {
        [Key]
        public int IdClase { get; set; }

        public int CedulaCliente { get; set; }
    }
}
