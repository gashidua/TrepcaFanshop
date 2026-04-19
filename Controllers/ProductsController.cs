using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using System.Collections.Generic;

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
        public ActionResult<List<Product>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<Product?> GetById(int id)
        {
            var product = _service.GetById(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public IActionResult Add(Product product)
        {
            var result = _service.Add(product);

            if (!result)
                return BadRequest("Produkti nuk u shtua. Kontrollo të dhënat.");

            return Ok("Produkti u shtua me sukses");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest("ID nuk përputhet");

            var result = _service.Update(product);

            if (!result)
                return NotFound("Produkti nuk ekziston");

            return Ok("Produkti u përditësua");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _service.Delete(id);

            if (!result)
                return NotFound("Produkti nuk ekziston");

            return Ok("Produkti u fshi");
        }
        
        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var stats = _service.GetStats();
            return Ok(stats);
        }

        [HttpGet("search")]
        public IActionResult Search(string keyword)
        {
            var result = _service.Search(keyword);
            return Ok(result);
        }

        [HttpGet("filter")]
        public IActionResult Filter(decimal minPrice)
        {
            var result = _service.FilterByPrice(minPrice);
            return Ok(result);
        }

    }
}