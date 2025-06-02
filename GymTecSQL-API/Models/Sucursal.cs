using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Sucursal
    {
        [Key]
        public int IdSucursal { get; set; }

        public required string DireccionSucursal { get; set; }

        public required DateTime FechaApertura { get; set; }

        public required string HorarioAtencion { get; set; }

        public required int IdSpa { get; set; }

        public required int IdTienda { get; set; }
    }
}
