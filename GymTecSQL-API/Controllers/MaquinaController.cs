using System.Collections.Generic;
using System.Threading.Tasks;
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
        public MaquinaController(GymTecContext context) => _context = context;

        // GET: api/Maquina
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Maquina>>> GetAll()
            => await _context.Maquina.ToListAsync();

        // GET: api/Maquina/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Maquina>> GetById(int id)
        {
            var m = await _context.Maquina.FindAsync(id);
            if (m == null) return NotFound();
            return m;
        }

        // POST: api/Maquina
        // Ahora acepta item.IdMaquina, item.IdMarcaMaquina, item.IdTipoEquipo, item.IdSucursal (nullable)
        [HttpPost]
        public async Task<ActionResult<Maquina>> Create([FromBody] Maquina item)
        {
            if (item == null)
                return BadRequest();

            _context.Maquina.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.IdMaquina }, item);
        }

        // PUT: api/Maquina/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Maquina item)
        {
            if (item == null || item.IdMaquina != id)
                return BadRequest();

            var existing = await _context.Maquina.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.IdMarcaMaquina = item.IdMarcaMaquina;
            existing.IdTipoEquipo = item.IdTipoEquipo;
            existing.IdSucursal = item.IdSucursal;  // ahora puede ser null

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Maquina/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var m = await _context.Maquina.FindAsync(id);
            if (m == null) return NotFound();

            _context.Maquina.Remove(m);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
