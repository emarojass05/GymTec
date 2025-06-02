using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HorarioSucursalController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los horariosucursal");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET horariosucursal {id}");

        [HttpPost]
        public IActionResult Create([FromBody] HorarioSucursal item) => Ok("POST nuevo horariosucursal");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] HorarioSucursal item) => Ok($"PUT horariosucursal {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE horariosucursal {id}");
    }
}
