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
    public class PlanillaController : ControllerBase
    {
        private readonly GymTecContext _context;

        public PlanillaController(GymTecContext context)
        {
            _context = context;
        }

        // GET api/Planilla/GeneratePayroll
        // Calcula el pago de todos los empleados sin usar un SP,
        // agrupado por sucursal según su tipo de planilla.
        [HttpGet("GeneratePayroll")]
        public IActionResult GeneratePayroll()
        {
            // Cargamos datos en memoria
            var empleados = _context.Empleado.ToList();
            var planillas = _context.Planilla.ToList();
            var sucursales = _context.Sucursal.ToList();
            var actividades = _context.ActividadLaboral.ToList();
            var clases = _context.Clase.ToList();

            // Proyección intermedia
            var resultados = empleados.Select(e =>
            {
                // Obtiene descripción del tipo de planilla
                var plan = planillas.FirstOrDefault(p => p.IdPlanilla == e.IdPlanilla);
                var tipo = plan?.DescripcionPlanilla ?? "Mensual";

                int unidades;
                double pago;

                if (tipo.Equals("Mensual", StringComparison.OrdinalIgnoreCase))
                {
                    unidades = 0;
                    pago = e.SalarioEmpleado;
                }
                else if (tipo.IndexOf("hora", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    // Suma de horas trabajadas
                    unidades = actividades
                        .Where(a => a.IdEmpleado == e.CedulaEmpleado)
                        .Sum(a => a.Horas);
                    pago = unidades * e.SalarioEmpleado;
                }
                else // Pago por clase
                {
                    unidades = clases
                        .Count(c => c.IdInstructorClase == e.CedulaEmpleado);
                    pago = unidades * e.SalarioEmpleado;
                }

                return new
                {
                    e.IdSucursal,
                    NombreSucursal = sucursales
                        .FirstOrDefault(s => s.IdSucursal == e.IdSucursal)
                        ?.DireccionSucursal,
                    Cedula = e.CedulaEmpleado,
                    NombreCompleto = e.NombreEmpleado,
                    TipoPlanilla = tipo,
                    Unidades = unidades,
                    Pago = pago
                };
            });

            // Agrupamos por sucursal
            var secciones = resultados
                .GroupBy(r => new { r.IdSucursal, r.NombreSucursal })
                .Select(g => new
                {
                    nombreSucursal = g.Key.NombreSucursal,
                    empleados = g.Select(x => new
                    {
                        x.Cedula,
                        x.NombreCompleto,
                        x.TipoPlanilla,
                        x.Unidades,
                        x.Pago
                    }).ToList()
                })
                .ToList();

            return Ok(secciones);
        }

        // GET api/Planilla
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _context.Planilla.ToList();
            return Ok(list);
        }

        // GET api/Planilla/5
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var item = _context.Planilla.Find(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST api/Planilla
        [HttpPost]
        public IActionResult Create([FromBody] Planilla item)
        {
            if (item == null) return BadRequest();
            _context.Planilla.Add(item);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = item.IdPlanilla }, item);
        }

        // PUT api/Planilla/5
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] Planilla item)
        {
            if (item == null || item.IdPlanilla != id) return BadRequest();
            var existing = _context.Planilla.Find(id);
            if (existing == null) return NotFound();
            existing.DescripcionPlanilla = item.DescripcionPlanilla;
            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE api/Planilla/5
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Planilla.Find(id);
            if (item == null) return NotFound();
            _context.Planilla.Remove(item);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
