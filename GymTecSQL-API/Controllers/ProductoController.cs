using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los producto");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET producto {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Producto item) => Ok("POST nuevo producto");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Producto item) => Ok($"PUT producto {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE producto {id}");
    }
}
