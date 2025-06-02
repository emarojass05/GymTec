using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Clase
    {
        [Key]
        public int IdClase { get; set; }

        public required int TipoClase { get; set; }

        public required int InstructorClase { get; set; }

        public required int ModalidadClase { get; set; }

        public required int CapacidadClase { get; set; }

        public required DateTime FechaClase { get; set; }

        public required TimeOnly HoraInicioClase { get; set; }

        public required TimeOnly HoraFinalizacionClase { get; set; }

        public required int IdSucursal { get; set; }
    }
}
