using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpaTratamientoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los spatratamiento");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET spatratamiento {id}");

        [HttpPost]
        public IActionResult Create([FromBody] SpaTratamiento item) => Ok("POST nuevo spatratamiento");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] SpaTratamiento item) => Ok($"PUT spatratamiento {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE spatratamiento {id}");
    }
}
