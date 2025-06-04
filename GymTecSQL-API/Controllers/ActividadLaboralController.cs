using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActividadLaboralController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ActividadLaboralController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var actividades = _context.ActividadLaboral.ToList();
            return Ok(actividades);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var actividad = _context.ActividadLaboral.Find(id);
            if (actividad == null)
                return NotFound();
            return Ok(actividad);
        }

        [HttpPost]
        public IActionResult Create([FromBody] ActividadLaboral item)
        {
            if (item == null)
                return BadRequest();

            // (Opcional) verificar que el empleado exista:
            // if (!_context.Empleado.Any(e => e.CedulaEmpleado == item.IdEmpleado))
            //     return BadRequest($"Empleado {item.IdEmpleado} no existe.");

            _context.ActividadLaboral.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdActividadLaboral }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ActividadLaboral item)
        {
            if (item == null || item.IdActividadLaboral != id)
                return BadRequest();

            var existing = _context.ActividadLaboral.Find(id);
            if (existing == null)
                return NotFound();

            // Actualizar campos
            existing.Año = item.Año;
            existing.Mes = item.Mes;
            existing.Horas = item.Horas;
            existing.IdEmpleado = item.IdEmpleado;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var actividad = _context.ActividadLaboral.Find(id);
            if (actividad == null)
                return NotFound();

            _context.ActividadLaboral.Remove(actividad);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
