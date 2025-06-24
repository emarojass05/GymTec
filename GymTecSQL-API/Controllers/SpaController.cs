using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpaController : ControllerBase
    {
        private readonly GymTecContext _context;

        public SpaController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/Spa?idsucursal=5
        [HttpGet]
        public IActionResult GetAll([FromQuery] int? idsucursal)
        {
            if (idsucursal.HasValue)
            {
                var filtered = _context.Spa
                    .Where(s => s.IdSucursal == idsucursal.Value)
                    .ToList();
                return Ok(filtered);
            }
            return Ok(_context.Spa.ToList());
        }

        // GET: api/Spa/10
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var spa = _context.Spa.Find(id);
            if (spa == null)
                return NotFound();
            return Ok(spa);
        }

        // POST: api/Spa
        [HttpPost]
        public IActionResult Create([FromBody] Spa item)
        {
            if (item == null)
                return BadRequest();

            // (Opcional) Validar existencia de Sucursal y Estado
            // if (!_context.Sucursal.Any(s => s.IdSucursal == item.IdSucursal)) return BadRequest();
            // if (!_context.Estado.Any(e => e.IdEstado == item.EstadoSpa)) return BadRequest();

            _context.Spa.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdSpa }, item);
        }

        // PUT: api/Spa/10
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Spa item)
        {
            if (item == null || item.IdSpa != id)
                return BadRequest();

            var existing = _context.Spa.Find(id);
            if (existing == null)
                return NotFound();

            existing.EstadoSpa = item.EstadoSpa;

            // (Opcional) Validar que las llaves foráneas aún existan
            // if (!_context.Sucursal.Any(s => s.IdSucursal == existing.IdSucursal)) return BadRequest();
            // if (!_context.Estado.Any(e => e.IdEstado == existing.EstadoSpa)) return BadRequest();

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Spa/10
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var spa = _context.Spa.Find(id);
            if (spa == null)
                return NotFound();

            _context.Spa.Remove(spa);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
