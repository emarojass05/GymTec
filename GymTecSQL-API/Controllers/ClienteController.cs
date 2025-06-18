using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ClienteController(GymTecContext context)
        {
            _context = context;
        }

        // Controllers/ClienteController.cs

        // GET: api/Cliente
        [HttpGet]
        public IActionResult GetAll()
        {
            var lista = (
                from c in _context.Cliente
                join e in _context.Empleado
                  on EF.Property<int?>(c, "IdInstructor") equals e.CedulaEmpleado
                  into grp
                from inst in grp.DefaultIfEmpty()
                select new
                {
                    c.CedulaCliente,
                    c.NombreCliente,
                    c.ApellidosCliente,
                    c.CorreoCliente,
                    // incluimos IdInstructor en la respuesta:
                    IdInstructor = EF.Property<int?>(c, "IdInstructor"),
                    InstructorName = inst != null
                        ? inst.NombreEmpleado 
                        : "sin instructor"
                }
            ).ToList();

            return Ok(lista);
        }


        // GET: api/Cliente/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var cliente = _context.Cliente.Find(id);
            if (cliente == null)
                return NotFound();
            return Ok(cliente);
        }

        // POST: api/Cliente
        [HttpPost]
        public IActionResult Create([FromBody] Cliente item)
        {
            if (item == null)
                return BadRequest();

            if (_context.Cliente.Any(c => c.CedulaCliente == item.CedulaCliente))
                return Conflict($"Ya existe un cliente con Cédula {item.CedulaCliente}.");

            _context.Cliente.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.CedulaCliente }, item);
        }

        // PUT: api/Cliente/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Cliente item)
        {
            if (item == null || item.CedulaCliente != id)
                return BadRequest();

            var existing = _context.Cliente.Find(id);
            if (existing == null)
                return NotFound();

            // Solo actualizar campos si vienen en el request (evitar sobrescribir con valores por defecto)
            if (item.NombreCliente != null)
                existing.NombreCliente = item.NombreCliente;
            if (item.ApellidosCliente != null)
                existing.ApellidosCliente = item.ApellidosCliente;
            if (item.FechaNacimiento != default(DateTime))
                existing.FechaNacimiento = item.FechaNacimiento;
            if (item.PesoCliente != default(double))
                existing.PesoCliente = item.PesoCliente;
            if (item.IMCCliente != default(double))
                existing.IMCCliente = item.IMCCliente;
            if (item.DireccionCliente != null)
                existing.DireccionCliente = item.DireccionCliente;
            if (item.CorreoCliente != null)
                existing.CorreoCliente = item.CorreoCliente;
            if (item.PasswordCliente != null)
                existing.PasswordCliente = item.PasswordCliente;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }


        // DELETE: api/Cliente/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cliente = _context.Cliente.Find(id);
            if (cliente == null)
                return NotFound();

            _context.Cliente.Remove(cliente);
            _context.SaveChanges();
            return NoContent();
        }

        // NUEVO ENDPOINT: autenticar por correo y contraseña
        // GET: api/Cliente/Authenticate?correo=algo@dominio.com&password=1234
        [HttpGet("Authenticate")]
        public IActionResult Authenticate([FromQuery] string correo, [FromQuery] string password)
        {
            if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(password))
                return BadRequest("Se requiere correo y contraseña.");

            var cliente = _context.Cliente
                .AsNoTracking()
                .FirstOrDefault(c => c.CorreoCliente == correo && c.PasswordCliente == password);

            if (cliente == null)
                return Unauthorized("Credenciales inválidas.");

            // Devolver solo los campos necesarios (incluyendo CedulaCliente)
            return Ok(new
            {
                cliente.CedulaCliente,
                cliente.NombreCliente,
                cliente.ApellidosCliente,
                cliente.CorreoCliente
            });
        }
        // POST api/Cliente/{cedula}/AsignarInstructor/{instructorId}

        [HttpPost("{cedula}/AsignarInstructor/{instructorId}")]
        [HttpGet("{cedula}/AsignarInstructor/{instructorId}")]
        public IActionResult AsignarInstructor(int cedula, int instructorId)
        {
            var cliente = _context.Cliente.Find(cedula);
            if (cliente == null)
                return NotFound($"Cliente {cedula} no existe.");

            var instructor = _context.Empleado.Find(instructorId);
            if (instructor == null)
                return NotFound($"Instructor {instructorId} no existe.");

            cliente.IdInstructor = instructorId;
            _context.SaveChanges();

            return NoContent();
        }


    }
}

