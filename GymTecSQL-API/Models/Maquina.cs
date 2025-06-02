using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Maquina
    {
        [Key]
        public int IdMaquina { get; set; }

        public required string MarcaMaquina { get; set; }

        public required int IdSucursal { get; set; }

        public required int IdTipoEquipo { get; set; }
    }
}
