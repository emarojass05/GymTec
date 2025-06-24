using System.Linq;
using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TelefonoSucursalController : ControllerBase
    {
        private readonly GymTecContext _context;

        public TelefonoSucursalController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoSucursal
        [HttpGet]
        public IActionResult GetAll()
        {
            var telefonos = _context.TelefonoSucursal.ToList();
            return Ok(telefonos);
        }

        // POST: api/TelefonoSucursal
        [HttpPost]
        public IActionResult Create([FromBody] TelefonoSucursal item)
        {
            if (item == null)
                return BadRequest();

            _context.TelefonoSucursal.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetBySucursal), new { idSucursal = item.IdSucursal }, item);
        }

        // GET: api/TelefonoSucursal/5
        [HttpGet("{idSucursal:int}")]
        public IActionResult GetBySucursal(int idSucursal)
        {
            var lista = _context.TelefonoSucursal
                                .Where(t => t.IdSucursal == idSucursal)
                                .ToList();
            if (!lista.Any())
                return NotFound();
            return Ok(lista);
        }

        // DELETE: api/TelefonoSucursal/123456/5
        [HttpDelete("{telefono:int}/{idSucursal:int}")]
        public IActionResult Delete(int telefono, int idSucursal)
        {
            var entry = _context.TelefonoSucursal
                                .SingleOrDefault(t => t.Telefono == telefono && t.IdSucursal == idSucursal);
            if (entry == null)
                return NotFound();

            _context.TelefonoSucursal.Remove(entry);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
