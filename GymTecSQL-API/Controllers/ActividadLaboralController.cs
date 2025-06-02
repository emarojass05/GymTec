using Microsoft.AspNetCore.Mvc;
using GymTecSQL_API.Models;

namespace GymTecSQL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActividadLaboralController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok("GET todos los actividadlaboral");

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok($"GET actividadlaboral {id}");

        [HttpPost]
        public IActionResult Create([FromBody] ActividadLaboral item) => Ok("POST nuevo actividadlaboral");

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ActividadLaboral item) => Ok($"PUT actividadlaboral {id}");

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Ok($"DELETE actividadlaboral {id}");
    }
}
