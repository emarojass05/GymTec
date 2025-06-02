using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoEquipoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los tipoequipo");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET tipoequipo {id}");

        [HttpPost]
        public IActionResult Create([FromBody] TipoEquipo item) => Ok("POST nuevo tipoequipo");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TipoEquipo item) => Ok($"PUT tipoequipo {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE tipoequipo {id}");
    }
}
