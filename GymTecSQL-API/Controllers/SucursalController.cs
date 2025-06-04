using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SucursalController : ControllerBase
    {
        private readonly GymTecContext _context;

        public SucursalController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var sucursales = _context.Sucursal.ToList();
            return Ok(sucursales);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var sucursal = _context.Sucursal.Find(id);
            if (sucursal == null)
                return NotFound();
            return Ok(sucursal);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Sucursal item)
        {
            if (item == null)
                return BadRequest();

            _context.Sucursal.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdSucursal }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Sucursal item)
        {
            if (item == null || item.IdSucursal != id)
                return BadRequest();

            var existing = _context.Sucursal.Find(id);
            if (existing == null)
                return NotFound();

            existing.DireccionSucursal = item.DireccionSucursal;
            existing.FechaApertura = item.FechaApertura;
            existing.HorarioAtencion = item.HorarioAtencion;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var sucursal = _context.Sucursal.Find(id);
            if (sucursal == null)
                return NotFound();

            _context.Sucursal.Remove(sucursal);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
