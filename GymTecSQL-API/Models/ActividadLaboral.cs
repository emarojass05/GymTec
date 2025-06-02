using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class ActividadLaboral
    {
        [Key]
        public int IdActividadLaboral { get; set; }

        public required int Año { get; set; }

        public required int Mes { get; set; }

        public required int Horas { get; set; }

        public required int IdClase { get; set; }

        public required int IdEmpleado { get; set; }
    }
}
