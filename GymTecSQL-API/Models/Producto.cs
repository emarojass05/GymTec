using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Producto
    {
        [Key]
        public int CodigoBarrasProducto { get; set; }

        public required string NombreProducto { get; set; }

        public required string DescripcionProducto { get; set; }

        public required double CostoProducto { get; set; }
    }
}
