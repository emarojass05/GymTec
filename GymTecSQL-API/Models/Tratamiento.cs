using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Tratamiento
    {
        [Key]
        public int IdTratamiento { get; set; }

        public required string NombreTratamiento { get; set; }
    }
}
