using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class TipoEquipo
    {
        [Key]
        public int IdTipoEquipo { get; set; }

        public required string DescripcionTipoEquipo { get; set; }
    }
}
