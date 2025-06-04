using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiendaProductoController : ControllerBase
    {
        private readonly GymTecContext _context;

        public TiendaProductoController(GymTecContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var lista = _context.TiendaProducto.ToList();
            return Ok(lista);
        }

        [HttpGet("{idTienda}/{codigoBarrasProducto}")]
        public IActionResult GetById(int idTienda, int codigoBarrasProducto)
        {
            var entidad = _context.TiendaProducto
                .Find(idTienda, codigoBarrasProducto);
            if (entidad == null)
                return NotFound();
            return Ok(entidad);
        }

        [HttpPost]
        public IActionResult Create([FromBody] TiendaProducto item)
        {
            if (item == null)
                return BadRequest();

            // Verificar duplicado en clave compuesta
            bool existe = _context.TiendaProducto
                .Any(tp => tp.IdTienda == item.IdTienda
                        && tp.CodigoBarrasProducto == item.CodigoBarrasProducto);
            if (existe)
                return Conflict($"Ya existe el registro TiendaProducto con IdTienda={item.IdTienda} y CódigoBarrasProducto={item.CodigoBarrasProducto}.");

            // (Opcional) validar existencia de Tienda y Producto:
            // if (!_context.Tienda.Any(t => t.IdTienda == item.IdTienda))
            //     return BadRequest($"Tienda {item.IdTienda} no existe.");
            // if (!_context.Producto.Any(p => p.CodigoBarrasProducto == item.CodigoBarrasProducto))
            //     return BadRequest($"Producto {item.CodigoBarrasProducto} no existe.");

            _context.TiendaProducto.Add(item);
            _context.SaveChanges();

            return CreatedAtAction(
                nameof(GetById),
                new { idTienda = item.IdTienda, codigoBarrasProducto = item.CodigoBarrasProducto },
                item);
        }

        [HttpPut("{idTienda}/{codigoBarrasProducto}")]
        public IActionResult Update(int idTienda, int codigoBarrasProducto, [FromBody] TiendaProducto item)
        {
            if (item == null
                || item.IdTienda != idTienda
                || item.CodigoBarrasProducto != codigoBarrasProducto)
                return BadRequest();

            var existing = _context.TiendaProducto
                .Find(idTienda, codigoBarrasProducto);
            if (existing == null)
                return NotFound();

            // No hay otros campos para actualizar, ya que solo existe la clave compuesta.
            // Si en el futuro se agregan más columnas, actualícelas aquí.

            return NoContent();
        }

        [HttpDelete("{idTienda}/{codigoBarrasProducto}")]
        public IActionResult Delete(int idTienda, int codigoBarrasProducto)
        {
            var entidad = _context.TiendaProducto
                .Find(idTienda, codigoBarrasProducto);
            if (entidad == null)
                return NotFound();

            _context.TiendaProducto.Remove(entidad);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
