using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymTecSQL_API.Models
{
    public class Maquina
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int IdMaquina { get; set; }

        [Required]
        public int IdMarcaMaquina { get; set; }

        public int? IdSucursal { get; set; }

        [Required]
        public int IdTipoEquipo { get; set; }
    }
}
