using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoEquipoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public TipoEquipoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var tipos = _context.TipoEquipo.ToList();
            return Ok(tipos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var tipo = _context.TipoEquipo.Find(id);
            if (tipo == null)
                return NotFound();
            return Ok(tipo);
        }

        [HttpPost]
        public IActionResult Create([FromBody] TipoEquipo item)
        {
            if (item == null)
                return BadRequest();

            _context.TipoEquipo.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdTipoEquipo }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TipoEquipo item)
        {
            if (item == null || item.IdTipoEquipo != id)
                return BadRequest();

            var existing = _context.TipoEquipo.Find(id);
            if (existing == null)
                return NotFound();

            existing.DescripcionTipoEquipo = item.DescripcionTipoEquipo;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var tipo = _context.TipoEquipo.Find(id);
            if (tipo == null)
                return NotFound();

            _context.TipoEquipo.Remove(tipo);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
