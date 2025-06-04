using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Estado
    {
        [Key]
        public int IdEstado { get; set; }

        public required string DescripcionEstado { get; set; }
    }
}
