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

        [HttpGet]
        public IActionResult GetAll()
        {
            var spas = _context.Spa.ToList();
            return Ok(spas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var spa = _context.Spa.Find(id);
            if (spa == null)
                return NotFound();
            return Ok(spa);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Spa item)
        {
            if (item == null)
                return BadRequest();

            // (Opcional) validar existencia de Sucursal y Estado:
            // if (!_context.Sucursal.Any(s => s.IdSucursal == item.IdSucursal))
            //     return BadRequest($"Sucursal {item.IdSucursal} no existe.");
            // if (!_context.Estado.Any(e => e.IdEstado == item.EstadoSpa))
            //     return BadRequest($"Estado {item.EstadoSpa} no existe.");

            _context.Spa.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdSpa }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Spa item)
        {
            if (item == null || item.IdSpa != id)
                return BadRequest();

            var existing = _context.Spa.Find(id);
            if (existing == null)
                return NotFound();

            existing.IdSucursal = item.IdSucursal;
            existing.EstadoSpa = item.EstadoSpa;

            // (Opcional) validar que las llaves foráneas aún existan:
            // if (!_context.Sucursal.Any(s => s.IdSucursal == existing.IdSucursal))
            //     return BadRequest($"Sucursal {existing.IdSucursal} no existe.");
            // if (!_context.Estado.Any(e => e.IdEstado == existing.EstadoSpa))
            //     return BadRequest($"Estado {existing.EstadoSpa} no existe.");

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

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
