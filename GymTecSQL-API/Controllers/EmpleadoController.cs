using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public EmpleadoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var empleados = _context.Empleado.ToList();
            return Ok(empleados);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var empleado = _context.Empleado.Find(id);
            if (empleado == null)
                return NotFound();
            return Ok(empleado);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Empleado item)
        {
            if (item == null)
                return BadRequest();

            // Validar clave primaria duplicada
            if (_context.Empleado.Any(e => e.CedulaEmpleado == item.CedulaEmpleado))
                return Conflict($"Ya existe un empleado con Cédula {item.CedulaEmpleado}.");

            // (Opcional) validar existencia de sucursal, puesto y planilla:
            // if (!_context.Sucursal.Any(s => s.IdSucursal == item.IdSucursal))
            //     return BadRequest($"Sucursal {item.IdSucursal} no existe.");
            // if (!_context.Puesto.Any(p => p.IdPuesto == item.IdPuesto))
            //     return BadRequest($"Puesto {item.IdPuesto} no existe.");
            // if (!_context.Planilla.Any(p => p.IdPlanilla == item.IdPlanilla))
            //     return BadRequest($"Planilla {item.IdPlanilla} no existe.");

            _context.Empleado.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.CedulaEmpleado }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Empleado item)
        {
            if (item == null || item.CedulaEmpleado != id)
                return BadRequest();

            var existing = _context.Empleado.Find(id);
            if (existing == null)
                return NotFound();

            // Actualizar campos
            existing.NombreEmpleado = item.NombreEmpleado;
            existing.DireccionEmpleado = item.DireccionEmpleado;
            existing.IdSucursal = item.IdSucursal;
            existing.IdPuesto = item.IdPuesto;
            existing.IdPlanilla = item.IdPlanilla;
            existing.SalarioEmpleado = item.SalarioEmpleado;
            existing.CorreoEmpleado = item.CorreoEmpleado;
            existing.PasswordEmpleado = item.PasswordEmpleado;

            // (Opcional) validar que las llaves foráneas sigan siendo válidas:
            // if (!_context.Sucursal.Any(s => s.IdSucursal == existing.IdSucursal))
            //     return BadRequest($"Sucursal {existing.IdSucursal} no existe.");
            // if (!_context.Puesto.Any(p => p.IdPuesto == existing.IdPuesto))
            //     return BadRequest($"Puesto {existing.IdPuesto} no existe.");
            // if (!_context.Planilla.Any(p => p.IdPlanilla == existing.IdPlanilla))
            //     return BadRequest($"Planilla {existing.IdPlanilla} no existe.");

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var empleado = _context.Empleado.Find(id);
            if (empleado == null)
                return NotFound();

            _context.Empleado.Remove(empleado);
            _context.SaveChanges();

            return NoContent();
        }

        // Dentro de GymTecSQL_API.Controllers.EmpleadoController
        [HttpGet("Authenticate")]
        public IActionResult Authenticate([FromQuery] string correo, [FromQuery] string password)
        {
            if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(password))
                return BadRequest("Se requiere correo y contraseña.");

            var empleado = _context.Empleado
                .AsNoTracking()
                .FirstOrDefault(e => e.CorreoEmpleado == correo && e.PasswordEmpleado == password);

            if (empleado == null)
                return Unauthorized("Credenciales inválidas.");

            return Ok(new
            {
                empleado.CedulaEmpleado,
                empleado.NombreEmpleado,
                empleado.CorreoEmpleado
            });
        }

    }
}
