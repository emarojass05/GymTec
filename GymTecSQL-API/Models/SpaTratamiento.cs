using System.ComponentModel.DataAnnotations;

namespace GymTecSQL_API.Models
{
    public class SpaTratamiento
    {
        [Key]
        public int Id { get; set; }

        public required int IdSpa { get; set; }

        public required int IdTratamiento { get; set; }
    }
}
