using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Spa
    {
        [Key]
        public int IdSpa { get; set; }

        public required int IdSucursal {  get; set; }

        public required int EstadoSpa { get; set; }
    }
}
