using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiendaController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los tienda");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET tienda {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Tienda item) => Ok("POST nueva tienda");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Tienda item) => Ok($"PUT tienda {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE tienda {id}");
    }
}
