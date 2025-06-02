using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Puesto
    {
        [Key]
        public int IdPuesto { get; set; }

        public required string DescripcionPuesto { get; set; }
    }
}
