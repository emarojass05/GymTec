using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaquinaController : ControllerBase
    {
        private readonly GymTecContext _context;

        public MaquinaController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var maquinas = _context.Maquina.ToList();
            return Ok(maquinas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var maquina = _context.Maquina.Find(id);
            if (maquina == null)
                return NotFound();
            return Ok(maquina);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Maquina item)
        {
            if (item == null)
                return BadRequest();

            // (Opcional) verificar existencia de llaves foráneas:
            // if (!_context.MarcaMaquina.Any(m => m.IdMarcaMaquina == item.IdMarcaMaquina))
            //     return BadRequest($"MarcaMaquina {item.IdMarcaMaquina} no existe.");
            // if (!_context.Sucursal.Any(s => s.IdSucursal == item.IdSucursal))
            //     return BadRequest($"Sucursal {item.IdSucursal} no existe.");
            // if (!_context.TipoEquipo.Any(te => te.IdTipoEquipo == item.IdTipoEquipo))
            //     return BadRequest($"TipoEquipo {item.IdTipoEquipo} no existe.");

            _context.Maquina.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdMaquina }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Maquina item)
        {
            if (item == null || item.IdMaquina != id)
                return BadRequest();

            var existing = _context.Maquina.Find(id);
            if (existing == null)
                return NotFound();

            // Actualizar campos
            existing.IdMarcaMaquina = item.IdMarcaMaquina;
            existing.IdSucursal = item.IdSucursal;
            existing.IdTipoEquipo = item.IdTipoEquipo;

            // (Opcional) validar llaves foráneas de nuevo:
            // if (!_context.MarcaMaquina.Any(m => m.IdMarcaMaquina == existing.IdMarcaMaquina))
            //     return BadRequest($"MarcaMaquina {existing.IdMarcaMaquina} no existe.");
            // if (!_context.Sucursal.Any(s => s.IdSucursal == existing.IdSucursal))
            //     return BadRequest($"Sucursal {existing.IdSucursal} no existe.");
            // if (!_context.TipoEquipo.Any(te => te.IdTipoEquipo == existing.IdTipoEquipo))
            //     return BadRequest($"TipoEquipo {existing.IdTipoEquipo} no existe.");

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var maquina = _context.Maquina.Find(id);
            if (maquina == null)
                return NotFound();

            _context.Maquina.Remove(maquina);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
