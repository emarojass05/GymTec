using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicioController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los servicio");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET servicio {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Servicio item) => Ok("POST nuevo servicio");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Servicio item) => Ok($"PUT servicio {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE servicio {id}");
    }
}
