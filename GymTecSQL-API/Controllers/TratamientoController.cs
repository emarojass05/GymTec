using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TratamientoController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los tratamiento");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET tratamiento {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Tratamiento item) => Ok("POST nuevo tratamiento");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Tratamiento item) => Ok($"PUT tratamiento {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE tratamiento {id}");
    }
}
