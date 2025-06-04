using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpaTratamientoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public SpaTratamientoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var lista = _context.SpaTratamiento.ToList();
            return Ok(lista);
        }

        [HttpGet("{idSpa}/{idTratamiento}")]
        public IActionResult GetById(int idSpa, int idTratamiento)
        {
            var entidad = _context.SpaTratamiento
                .Find(idSpa, idTratamiento);
            if (entidad == null)
                return NotFound();
            return Ok(entidad);
        }

        [HttpPost]
        public IActionResult Create([FromBody] SpaTratamiento item)
        {
            if (item == null)
                return BadRequest();

            // Verificar duplicado en clave compuesta
            bool existe = _context.SpaTratamiento
                .Any(st => st.IdSpa == item.IdSpa && st.IdTratamiento == item.IdTratamiento);
            if (existe)
                return Conflict($"Ya existe el registro SpaTratamiento con IdSpa={item.IdSpa} e IdTratamiento={item.IdTratamiento}.");

            // (Opcional) validar existencia de Spa y Tratamiento:
            // if (!_context.Spa.Any(s => s.IdSpa == item.IdSpa))
            //     return BadRequest($"Spa {item.IdSpa} no existe.");
            // if (!_context.Tratamiento.Any(t => t.IdTratamiento == item.IdTratamiento))
            //     return BadRequest($"Tratamiento {item.IdTratamiento} no existe.");

            _context.SpaTratamiento.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById),
                new { idSpa = item.IdSpa, idTratamiento = item.IdTratamiento },
                item);
        }

        [HttpPut("{idSpa}/{idTratamiento}")]
        public IActionResult Update(int idSpa, int idTratamiento, [FromBody] SpaTratamiento item)
        {
            if (item == null || item.IdSpa != idSpa || item.IdTratamiento != idTratamiento)
                return BadRequest();

            var existing = _context.SpaTratamiento
                .Find(idSpa, idTratamiento);
            if (existing == null)
                return NotFound();

            // No hay campos adicionales más allá de la clave compuesta.
            // Simplemente devolvemos NoContent para indicar que la entidad existe y fue "actualizada" sin cambios.
            return NoContent();
        }

        [HttpDelete("{idSpa}/{idTratamiento}")]
        public IActionResult Delete(int idSpa, int idTratamiento)
        {
            var entidad = _context.SpaTratamiento
                .Find(idSpa, idTratamiento);
            if (entidad == null)
                return NotFound();

            _context.SpaTratamiento.Remove(entidad);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
