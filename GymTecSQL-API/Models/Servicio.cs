using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Servicio
    {
        [Key]
        public int IdServicio { get; set; }

        public required string DescripcionServicio { get; set; }

        public required int IdSucursal { get; set; }
    }
}
