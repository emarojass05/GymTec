using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanillaController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los planilla");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET planilla {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Planilla item) => Ok("POST nueva planilla");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Planilla item) => Ok($"PUT planilla {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE planilla {id}");
    }
}
