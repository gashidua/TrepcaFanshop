using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;

namespace TrepcaFanshopApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductController(ProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] string? type)
        {
            var products = _service.List(type);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _service.GetById(id);
            if (product == null)
                return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public IActionResult Add([FromBody] Product product)
        {
            try
            {
                _service.Add(product);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product product)
        {
            if (id != product.Id)
                return BadRequest("Id nuk përputhet");

            var existing = _service.GetById(id);
            if (existing == null)
                return NotFound();

            _service.Update(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _service.GetById(id);
            if (existing == null)
                return NotFound();

            _service.Delete(id);
            return NoContent();
        }
    }
}
