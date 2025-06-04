using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaseController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ClaseController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var clases = _context.Clase.ToList();
            return Ok(clases);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var clase = _context.Clase.Find(id);
            if (clase == null)
                return NotFound();
            return Ok(clase);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Clase item)
        {
            if (item == null)
                return BadRequest();

            // Si necesitas validar que la sucursal exista, puedes hacerlo aquí:
            // if (!_context.Sucursal.Any(s => s.IdSucursal == item.IdSucursal))
            //     return BadRequest($"Sucursal {item.IdSucursal} no existe.");

            _context.Clase.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdClase }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Clase item)
        {
            if (item == null || item.IdClase != id)
                return BadRequest();

            var existing = _context.Clase.Find(id);
            if (existing == null)
                return NotFound();

            // Actualizar campos
            existing.TipoClase = item.TipoClase;
            existing.IdInstructorClase = item.IdInstructorClase;
            existing.Grupal = item.Grupal;
            existing.CapacidadClase = item.CapacidadClase;
            existing.FechaClase = item.FechaClase;
            existing.HoraInicioClase = item.HoraInicioClase;
            existing.HoraFinalizacionClase = item.HoraFinalizacionClase;
            existing.IdSucursal = item.IdSucursal;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var clase = _context.Clase.Find(id);
            if (clase == null)
                return NotFound();

            _context.Clase.Remove(clase);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
