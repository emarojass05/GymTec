using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpaController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los spa");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET spa {id}");

        [HttpPost]
        public IActionResult Create([FromBody] Spa item) => Ok("POST nuevo spa");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Spa item) => Ok($"PUT spa {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE spa {id}");
    }
}
