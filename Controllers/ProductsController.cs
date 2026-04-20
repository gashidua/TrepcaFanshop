using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using System;

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

        // GET: api/product
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _service.GetAll();
            return Ok(products);
        }

        // GET: api/product/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _service.GetById(id);

            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        // POST: api/product
        [HttpPost]
        public IActionResult Create(Product product)
        {
            try
            {
                _service.Add(product);
                return Ok(new { message = "Product created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/product/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, Product product)
        {
            try
            {
                if (id != product.Id)
                    return BadRequest(new { message = "ID mismatch" });

                _service.Update(product);

                return Ok(new { message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new { message = ex.Message });

                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/product/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _service.Delete(id);
                return Ok(new { message = "Product deleted successfully" });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new { message = ex.Message });

                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/product/search?keyword=...
        [HttpGet("search")]
        public IActionResult Search(string keyword)
        {
            var result = _service.Search(keyword);
            return Ok(result);
        }

        // GET: api/product/filter?minPrice=10
        [HttpGet("filter")]
        public IActionResult Filter(decimal minPrice)
        {
            var result = _service.FilterByPrice(minPrice);
            return Ok(result);
        }

        // GET: api/product/stats
        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var stats = _service.GetStats();
            return Ok(stats);
        }
    }
}