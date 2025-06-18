using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaseController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ClaseController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/Clase
        [HttpGet]
        public IActionResult GetAll()
        {
            var clases = _context.Clase.ToList();
            return Ok(clases);
        }

        // GET: api/Clase/5
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var clase = _context.Clase.Find(id);
            if (clase == null)
                return NotFound();
            return Ok(clase);
        }

        // POST: api/Clase
        [HttpPost]
        public IActionResult Create([FromBody] Clase item)
        {
            if (item == null)
                return BadRequest();

            // Asegurar que FechaClase tenga Kind=Utc antes de guardar
            item.FechaClase = DateTime.SpecifyKind(item.FechaClase, DateTimeKind.Utc);

            _context.Clase.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.IdClase }, item);
        }

        // PUT: api/Clase/5
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] Clase item)
        {
            if (item == null || item.IdClase != id)
                return BadRequest();

            var existing = _context.Clase.Find(id);
            if (existing == null)
                return NotFound();

            existing.TipoClase = item.TipoClase;
            existing.IdInstructorClase = item.IdInstructorClase;
            existing.Grupal = item.Grupal;
            existing.CapacidadClase = item.CapacidadClase;
            // Convertir FechaClase a UTC
            existing.FechaClase = DateTime.SpecifyKind(item.FechaClase, DateTimeKind.Utc);
            existing.HoraInicioClase = item.HoraInicioClase;
            existing.HoraFinalizacionClase = item.HoraFinalizacionClase;
            existing.IdSucursal = item.IdSucursal;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Clase/5
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var clase = _context.Clase.Find(id);
            if (clase == null)
                return NotFound();

            _context.Clase.Remove(clase);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
