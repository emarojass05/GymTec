using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymTecSQL_API.Models
{
    public class Empleado
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
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
