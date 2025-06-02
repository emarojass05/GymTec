using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuestoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los puesto");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET puesto {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Puesto item) => Ok("POST nuevo puesto");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Puesto item) => Ok($"PUT puesto {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE puesto {id}");
    }
}
