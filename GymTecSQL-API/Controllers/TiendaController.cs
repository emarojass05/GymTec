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

        [HttpGet]
        public IActionResult GetAll()
        {
            var tiendas = _context.Tienda.ToList();
            return Ok(tiendas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var tienda = _context.Tienda.Find(id);
            if (tienda == null)
                return NotFound();
            return Ok(tienda);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Tienda item)
        {
            if (item == null)
                return BadRequest();

            // (Opcional) validar llaves foráneas:
            // if (!_context.Estado.Any(e => e.IdEstado == item.EstadoTienda))
            //     return BadRequest($"Estado {item.EstadoTienda} no existe.");
            // if (!_context.Sucursal.Any(s => s.IdSucursal == item.IdSucursal))
            //     return BadRequest($"Sucursal {item.IdSucursal} no existe.");

            _context.Tienda.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdTienda }, item);
        }

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

            // (Opcional) validar llaves foráneas de nuevo:
            // if (!_context.Estado.Any(e => e.IdEstado == existing.EstadoTienda))
            //     return BadRequest($"Estado {existing.EstadoTienda} no existe.");
            // if (!_context.Sucursal.Any(s => s.IdSucursal == existing.IdSucursal))
            //     return BadRequest($"Sucursal {existing.IdSucursal} no existe.");

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

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
