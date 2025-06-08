using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsistenciaClaseController : ControllerBase
    {
        private readonly GymTecContext _context;

        public AsistenciaClaseController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/AsistenciaClase
        [HttpGet]
        public IActionResult GetAll()
        {
            var lista = _context.AsistenciaClase.ToList();
            return Ok(lista);
        }

        // GET: api/AsistenciaClase/{cedulaCliente}/{idClase}
        [HttpGet("{cedulaCliente}/{idClase}")]
        public IActionResult GetById(int cedulaCliente, int idClase)
        {
            var entidad = _context.AsistenciaClase.Find(cedulaCliente, idClase);
            if (entidad == null)
                return NotFound();
            return Ok(entidad);
        }

        // POST: api/AsistenciaClase
        [HttpPost]
        public IActionResult Create([FromBody] AsistenciaClase item)
        {
            if (item == null)
                return BadRequest();

            bool exists = _context.AsistenciaClase
                .Any(a => a.CedulaCliente == item.CedulaCliente && a.IdClase == item.IdClase);
            if (exists)
                return Conflict($"Ya existe asistencia para Cliente {item.CedulaCliente} en Clase {item.IdClase}.");

            _context.AsistenciaClase.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById),
                new { cedulaCliente = item.CedulaCliente, idClase = item.IdClase },
                item);
        }

        // PUT: api/AsistenciaClase/{cedulaCliente}/{idClase}
        [HttpPut("{cedulaCliente}/{idClase}")]
        public IActionResult Update(int cedulaCliente, int idClase, [FromBody] AsistenciaClase item)
        {
            if (item == null
                || item.CedulaCliente != cedulaCliente
                || item.IdClase != idClase)
                return BadRequest();

            var existing = _context.AsistenciaClase.Find(cedulaCliente, idClase);
            if (existing == null)
                return NotFound();

            // No hay campos adicionales para actualizar;
            // simplemente devolvemos NoContent para indicar que existe.
            return NoContent();
        }

        // DELETE: api/AsistenciaClase/{cedulaCliente}/{idClase}
        [HttpDelete("{cedulaCliente}/{idClase}")]
        public IActionResult Delete(int cedulaCliente, int idClase)
        {
            var entidad = _context.AsistenciaClase.Find(cedulaCliente, idClase);
            if (entidad == null)
                return NotFound();

            _context.AsistenciaClase.Remove(entidad);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
