using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class ServicioSucursal
    {
        [Key]
        public int IdServicio { get; set; }

        public required int IdSucursal { get; set; }
    }
}
