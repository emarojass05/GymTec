using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicioSucursalController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ServicioSucursalController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/ServicioSucursal
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioSucursal>>> GetAll()
        {
            return await _context.ServicioSucursal.ToListAsync();
        }

        // POST: api/ServicioSucursal
        // Body: { "idServicio": 1, "idSucursal": 2 }
        [HttpPost]
        public async Task<ActionResult<ServicioSucursal>> Create([FromBody] ServicioSucursal item)
        {
            if (item == null)
                return BadRequest("Datos inválidos.");

            // Evitar duplicados
            var exists = await _context.ServicioSucursal
                .AnyAsync(ss => ss.IdServicio == item.IdServicio && ss.IdSucursal == item.IdSucursal);
            if (exists)
                return Conflict("La relación ya existe.");

            _context.ServicioSucursal.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), null, item);
        }

        // DELETE: api/ServicioSucursal/5/2
        [HttpDelete("{idServicio:int}/{idSucursal:int}")]
        public async Task<IActionResult> Delete(int idServicio, int idSucursal)
        {
            var entity = await _context.ServicioSucursal.FindAsync(idServicio, idSucursal);
            if (entity == null)
                return NotFound("Relación no encontrada.");

            _context.ServicioSucursal.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
