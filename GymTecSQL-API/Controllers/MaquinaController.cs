using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaquinaController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los maquina");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET maquina {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Maquina item) => Ok("POST nuevo maquina");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Maquina item) => Ok($"PUT maquina {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE maquina {id}");
    }
}
