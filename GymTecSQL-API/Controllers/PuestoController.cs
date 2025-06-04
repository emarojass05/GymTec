using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuestoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public PuestoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var puestos = _context.Puesto.ToList();
            return Ok(puestos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var puesto = _context.Puesto.Find(id);
            if (puesto == null)
                return NotFound();
            return Ok(puesto);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Puesto item)
        {
            if (item == null)
                return BadRequest();

            _context.Puesto.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdPuesto }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Puesto item)
        {
            if (item == null || item.IdPuesto != id)
                return BadRequest();

            var existing = _context.Puesto.Find(id);
            if (existing == null)
                return NotFound();

            existing.DescripcionPuesto = item.DescripcionPuesto;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var puesto = _context.Puesto.Find(id);
            if (puesto == null)
                return NotFound();

            _context.Puesto.Remove(puesto);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
