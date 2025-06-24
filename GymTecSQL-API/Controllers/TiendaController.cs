using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiendaController : ControllerBase
    {
        private readonly GymTecContext _context;

        public TiendaController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/Tienda?idsucursal=5
        [HttpGet]
        public IActionResult GetAll([FromQuery] int? idsucursal)
        {
            if (idsucursal.HasValue)
            {
                var filtered = _context.Tienda
                    .Where(t => t.IdSucursal == idsucursal.Value)
                    .ToList();
                return Ok(filtered);
            }
            return Ok(_context.Tienda.ToList());
        }

        // GET: api/Tienda/10
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var tienda = _context.Tienda.Find(id);
            if (tienda == null)
                return NotFound();
            return Ok(tienda);
        }

        // POST: api/Tienda
        [HttpPost]
        public IActionResult Create([FromBody] Tienda item)
        {
            if (item == null)
                return BadRequest();

            _context.Tienda.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdTienda }, item);
        }

        // PUT: api/Tienda/10
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Tienda item)
        {
            if (item == null || item.IdTienda != id)
                return BadRequest();

            var existing = _context.Tienda.Find(id);
            if (existing == null)
                return NotFound();

            existing.EstadoTienda = item.EstadoTienda;
            existing.IdSucursal = item.IdSucursal;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Tienda/10
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var tienda = _context.Tienda.Find(id);
            if (tienda == null)
                return NotFound();

            _context.Tienda.Remove(tienda);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
