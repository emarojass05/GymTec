using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymTecSQL_API.Models
{
    public class Producto
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int CodigoBarrasProducto { get; set; }

        public required string NombreProducto { get; set; }

        public required string DescripcionProducto { get; set; }

        public required double CostoProducto { get; set; }
    }
}
