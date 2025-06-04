using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanillaController : ControllerBase
    {
        private readonly GymTecContext _context;

        public PlanillaController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var planillas = _context.Planilla.ToList();
            return Ok(planillas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var planilla = _context.Planilla.Find(id);
            if (planilla == null)
                return NotFound();
            return Ok(planilla);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Planilla item)
        {
            if (item == null)
                return BadRequest();

            _context.Planilla.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdPlanilla }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Planilla item)
        {
            if (item == null || item.IdPlanilla != id)
                return BadRequest();

            var existing = _context.Planilla.Find(id);
            if (existing == null)
                return NotFound();

            existing.DescripcionPlanilla = item.DescripcionPlanilla;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var planilla = _context.Planilla.Find(id);
            if (planilla == null)
                return NotFound();

            _context.Planilla.Remove(planilla);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
