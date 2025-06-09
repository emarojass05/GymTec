using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarcaMaquinaController : ControllerBase
    {
        private readonly GymTecContext _context;
        public MarcaMaquinaController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/MarcaMaquina
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MarcaMaquina>>> GetAll()
            => await _context.MarcaMaquina.ToListAsync();

        // GET: api/MarcaMaquina/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MarcaMaquina>> GetById(int id)
        {
            var marca = await _context.MarcaMaquina.FindAsync(id);
            if (marca == null) return NotFound();
            return marca;
        }

        // POST: api/MarcaMaquina
        [HttpPost]
        public async Task<ActionResult<MarcaMaquina>> Create([FromBody] MarcaMaquina item)
        {
            if (item == null) return BadRequest();
            _context.MarcaMaquina.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = item.IdMarcaMaquina }, item);
        }

        // PUT: api/MarcaMaquina/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MarcaMaquina item)
        {
            if (item == null || id != item.IdMarcaMaquina) return BadRequest();
            var existing = await _context.MarcaMaquina.FindAsync(id);
            if (existing == null) return NotFound();

            existing.NombreMarcaMaquina = item.NombreMarcaMaquina;
            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/MarcaMaquina/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var marca = await _context.MarcaMaquina.FindAsync(id);
            if (marca == null) return NotFound();
            _context.MarcaMaquina.Remove(marca);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
