using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymTecSQL_API.Models
{
    public class TelefonoSucursal
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Telefono { get; set; }

        public required int IdSucursal { get; set; }
    }
}
