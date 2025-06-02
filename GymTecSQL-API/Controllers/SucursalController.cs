using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SucursalController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los sucursal");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET sucursal {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Sucursal item) => Ok("POST nueva sucursal");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Sucursal item) => Ok($"PUT sucursal {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE sucursal {id}");
    }
}
