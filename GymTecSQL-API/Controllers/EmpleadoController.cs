using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los empleado");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET empleado {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Empleado item) => Ok("POST nuevo empleado");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Empleado item) => Ok($"PUT empleado {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE empleado {id}");
    }
}
