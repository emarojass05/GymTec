using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Empleado
    {
        [Key]
        public int CedulaEmpleado { get; set; }

        public required string NombreEmpleado { get; set; }

        public required string DireccionEmpleado { get; set; }

        public required int IdSucursal { get; set; }

        public required int IdPuesto { get; set; }

        public required int IdPlanilla { get; set; }

        public required double SalarioEmpleado { get; set; }

        public required string CorreoEmpleado { get; set; }

        public required string PasswordEmpleado { get; set; }
    }
}
