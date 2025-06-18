using System;
using System.Collections.Generic;
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
        // Buffer estático, ahora nullable
        private static CopyBuffer? _buffer;

        public SucursalController(GymTecContext context)
        {
            _context = context;
        }

        // GET: api/Sucursal
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Sucursal.ToList());
        }

        // GET: api/Sucursal/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var suc = _context.Sucursal.Find(id);
            if (suc == null) return NotFound();
            return Ok(suc);
        }

        // POST: api/Sucursal
        [HttpPost]
        public IActionResult Create([FromBody] Sucursal item)
        {
            if (item == null) return BadRequest();
            _context.Sucursal.Add(item);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = item.IdSucursal }, item);
        }

        // PUT: api/Sucursal/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Sucursal item)
        {
            if (item == null || item.IdSucursal != id) return BadRequest();
            var existing = _context.Sucursal.Find(id);
            if (existing == null) return NotFound();

            existing.DireccionSucursal = item.DireccionSucursal;
            existing.FechaApertura = item.FechaApertura;
            existing.HorarioAtencion = item.HorarioAtencion;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/Sucursal/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var suc = _context.Sucursal.Find(id);
            if (suc == null) return NotFound();
            _context.Sucursal.Remove(suc);
            _context.SaveChanges();
            return NoContent();
        }

        // GET: api/Sucursal/{id}/CopyData
        [HttpGet("{id}/CopyData")]
        public IActionResult CopyData(int id)
        {
            // SpaTratamientos
            var spa = _context.Spa.SingleOrDefault(s => s.IdSucursal == id);
            var spaTratamientos = spa == null
                ? new List<int>()
                : _context.SpaTratamiento
                    .Where(st => st.IdSpa == spa.IdSpa)
                    .Select(st => st.IdTratamiento)
                    .ToList();

            // TiendaProductos
            var tienda = _context.Tienda.SingleOrDefault(t => t.IdSucursal == id);
            var tiendaProductos = tienda == null
                ? new List<int>()
                : _context.TiendaProducto
                    .Where(tp => tp.IdTienda == tienda.IdTienda)
                    .Select(tp => tp.CodigoBarrasProducto)
                    .ToList();

            // Clases sin instructor ➔ usar DTO intermedio
            var clasesTpl = _context.Clase
                .Where(c => c.IdSucursal == id && c.IdInstructorClase == 0)
                .Select(c => new ClaseTemplate
                {
                    TipoClase = c.TipoClase,
                    IdInstructorClase = 0,
                    Grupal = c.Grupal,
                    CapacidadClase = c.CapacidadClase,
                    FechaClase = c.FechaClase,
                    HoraInicioClase = c.HoraInicioClase,
                    HoraFinalizacionClase = c.HoraFinalizacionClase
                })
                .ToList();

            // Llenar buffer
            _buffer = new CopyBuffer
            {
                SourceSucursalId = id,
                SpaTratamientos = spaTratamientos,
                TiendaProductos = tiendaProductos,
                ClaseTemplates = clasesTpl
            };

            return Ok();
        }

        // POST: api/Sucursal/{targetId}/PasteData/{sourceId}
        [HttpPost("{targetId}/PasteData/{sourceId}")]
        public IActionResult PasteData(int targetId, int sourceId)
        {
            if (_buffer == null || _buffer.SourceSucursalId != sourceId)
                return BadRequest("No hay datos copiados o sucursal origen incorrecta.");

            // 1) SPA
            var spaDest = _context.Spa.SingleOrDefault(s => s.IdSucursal == targetId);
            if (spaDest == null)
            {
                spaDest = new Spa { IdSucursal = targetId, EstadoSpa = 1 };
                _context.Spa.Add(spaDest);
                _context.SaveChanges();
            }
            _context.SpaTratamiento.RemoveRange(
                _context.SpaTratamiento.Where(st => st.IdSpa == spaDest.IdSpa));
            foreach (var trId in _buffer.SpaTratamientos)
                _context.SpaTratamiento.Add(new SpaTratamiento { IdSpa = spaDest.IdSpa, IdTratamiento = trId });

            // 2) TIENDA
            var tiendaDest = _context.Tienda.SingleOrDefault(t => t.IdSucursal == targetId);
            if (tiendaDest == null)
            {
                tiendaDest = new Tienda { IdSucursal = targetId, EstadoTienda = 1 };
                _context.Tienda.Add(tiendaDest);
                _context.SaveChanges();
            }
            _context.TiendaProducto.RemoveRange(
                _context.TiendaProducto.Where(tp => tp.IdTienda == tiendaDest.IdTienda));
            foreach (var prod in _buffer.TiendaProductos)
                _context.TiendaProducto.Add(new TiendaProducto { IdTienda = tiendaDest.IdTienda, CodigoBarrasProducto = prod });

            // 3) CLASES sin instructor
            var viejas = _context.Clase.Where(c => c.IdSucursal == targetId && c.IdInstructorClase == 0);
            _context.Clase.RemoveRange(viejas);
            foreach (var tpl in _buffer.ClaseTemplates)
            {
                var nueva = new Clase
                {
                    TipoClase = tpl.TipoClase,
                    IdInstructorClase = tpl.IdInstructorClase,
                    Grupal = tpl.Grupal,
                    CapacidadClase = tpl.CapacidadClase,
                    FechaClase = tpl.FechaClase,
                    HoraInicioClase = tpl.HoraInicioClase,
                    HoraFinalizacionClase = tpl.HoraFinalizacionClase,
                    IdSucursal = targetId
                };
                _context.Clase.Add(nueva);
            }

            _context.SaveChanges();
            return NoContent();
        }

        // Buffer interno
        private class CopyBuffer
        {
            public int SourceSucursalId { get; set; }
            public List<int> SpaTratamientos { get; set; } = new();
            public List<int> TiendaProductos { get; set; } = new();
            public List<ClaseTemplate> ClaseTemplates { get; set; } = new();
        }

        // DTO para clonar la plantilla de Clase
        private class ClaseTemplate
        {
            public int TipoClase { get; set; }
            public int IdInstructorClase { get; set; }
            public bool Grupal { get; set; }
            public int CapacidadClase { get; set; }
            public DateTime FechaClase { get; set; }
            public TimeOnly HoraInicioClase { get; set; }
            public TimeOnly HoraFinalizacionClase { get; set; }
            // NO IdSucursal aquí
        }
    }
}
