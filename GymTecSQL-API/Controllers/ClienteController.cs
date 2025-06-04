using System.Collections.Generic;
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

        [HttpGet]
        public IActionResult GetAll()
        {
            var clientes = _context.Cliente.ToList();
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var cliente = _context.Cliente.Find(id);
            if (cliente == null)
                return NotFound();
            return Ok(cliente);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Cliente item)
        {
            if (item == null)
                return BadRequest();

            // Verificar si ya existe un cliente con la misma cédula
            if (_context.Cliente.Any(c => c.CedulaCliente == item.CedulaCliente))
                return Conflict($"Ya existe un cliente con Cédula {item.CedulaCliente}.");

            _context.Cliente.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.CedulaCliente }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Cliente item)
        {
            if (item == null || item.CedulaCliente != id)
                return BadRequest();

            var existing = _context.Cliente.Find(id);
            if (existing == null)
                return NotFound();

            // Actualizar campos
            existing.NombreCliente = item.NombreCliente;
            existing.ApellidosCliente = item.ApellidosCliente;
            existing.FechaNacimiento = item.FechaNacimiento;
            existing.PesoCliente = item.PesoCliente;
            existing.IMCCliente = item.IMCCliente;
            existing.DireccionCliente = item.DireccionCliente;
            existing.CorreoCliente = item.CorreoCliente;
            existing.PasswordCliente = item.PasswordCliente;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

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
    }
}
