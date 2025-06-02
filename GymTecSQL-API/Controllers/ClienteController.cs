using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los cliente");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET cliente {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Cliente item) => Ok("POST nuevo cliente");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Cliente item) => Ok($"PUT cliente {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE cliente {id}");
    }
}
