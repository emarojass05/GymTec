using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TratamientoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public TratamientoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var tratamientos = _context.Tratamiento.ToList();
            return Ok(tratamientos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var tratamiento = _context.Tratamiento.Find(id);
            if (tratamiento == null)
                return NotFound();
            return Ok(tratamiento);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Tratamiento item)
        {
            if (item == null)
                return BadRequest();

            _context.Tratamiento.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdTratamiento }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Tratamiento item)
        {
            if (item == null || item.IdTratamiento != id)
                return BadRequest();

            var existing = _context.Tratamiento.Find(id);
            if (existing == null)
                return NotFound();

            existing.NombreTratamiento = item.NombreTratamiento;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var tratamiento = _context.Tratamiento.Find(id);
            if (tratamiento == null)
                return NotFound();

            _context.Tratamiento.Remove(tratamiento);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
