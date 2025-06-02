using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiendaProductoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los tiendaproducto");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET tiendaproducto {id}");

        [HttpPost]
        public IActionResult Create([FromBody] TiendaProducto item) => Ok("POST nuevo tiendaproducto");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TiendaProducto item) => Ok($"PUT tiendaproducto {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE tiendaproducto {id}");
    }
}
