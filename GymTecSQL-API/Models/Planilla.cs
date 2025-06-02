using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class Planilla
    {
        [Key]
        public int IdPlanilla { get; set; }

        public required string DescripcionPlanilla { get; set; }
    }
}
