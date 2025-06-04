using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public ProductoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var productos = _context.Producto.ToList();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var producto = _context.Producto.Find(id);
            if (producto == null)
                return NotFound();
            return Ok(producto);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Producto item)
        {
            if (item == null)
                return BadRequest();

            // Verificar que no exista un producto con el mismo código de barras
            if (_context.Producto.Any(p => p.CodigoBarrasProducto == item.CodigoBarrasProducto))
                return Conflict($"Ya existe un producto con Código de Barras {item.CodigoBarrasProducto}.");

            _context.Producto.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = item.CodigoBarrasProducto }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Producto item)
        {
            if (item == null || item.CodigoBarrasProducto != id)
                return BadRequest();

            var existing = _context.Producto.Find(id);
            if (existing == null)
                return NotFound();

            // Actualizar campos
            existing.NombreProducto = item.NombreProducto;
            existing.DescripcionProducto = item.DescripcionProducto;
            existing.CostoProducto = item.CostoProducto;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var producto = _context.Producto.Find(id);
            if (producto == null)
                return NotFound();

            _context.Producto.Remove(producto);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
