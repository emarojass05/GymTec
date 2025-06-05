using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicioController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ServicioController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var servicios = _context.Servicio.ToList();
            return Ok(servicios);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var servicio = _context.Servicio.Find(id);
            if (servicio == null)
                return NotFound();
            return Ok(servicio);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Servicio item)
        {
            if (item == null)
                return BadRequest();

            _context.Servicio.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdServicio }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Servicio item)
        {
            if (item == null || item.IdServicio != id)
                return BadRequest();

            var existing = _context.Servicio.Find(id);
            if (existing == null)
                return NotFound();

            existing.DescripcionServicio = item.DescripcionServicio;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var servicio = _context.Servicio.Find(id);
            if (servicio == null)
                return NotFound();

            _context.Servicio.Remove(servicio);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
