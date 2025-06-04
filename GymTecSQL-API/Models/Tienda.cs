using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Tienda
    {
        [Key]
        public int IdTienda { get; set; }

        public required int EstadoTienda { get; set; }

        public required int IdSucursal {  get; set; }
    }
}
