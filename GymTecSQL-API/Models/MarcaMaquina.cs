using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class MarcaMaquina
    {
        [Key]
        public int IdMarcaMaquina { get; set; }

        public required string NombreMarcaMaquina { get; set; }
    }
}
