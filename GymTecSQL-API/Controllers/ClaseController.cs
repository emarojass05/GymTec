using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaseController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los clase");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET clase {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Clase item) => Ok("POST nuevo clase");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Clase item) => Ok($"PUT clase {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE clase {id}");
    }
}
