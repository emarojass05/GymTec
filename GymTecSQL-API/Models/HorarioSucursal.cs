using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class HorarioSucursal
    {
        [Key]
        public int IdHorario { get; set; }

        public required int IdSucursal { get; set; }

        public required string DiaSemana { get; set; } 

        public required TimeOnly HoraApertura { get; set; }

        public required TimeOnly HoraCierre { get; set; }
    }
}
