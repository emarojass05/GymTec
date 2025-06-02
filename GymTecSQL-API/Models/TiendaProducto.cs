using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class TiendaProducto
    {
        [Key]
        public int Id { get; set; }

        public required int IdTienda { get; set; }

        public required int CodigoBarrasProducto { get; set; }
    }
}
