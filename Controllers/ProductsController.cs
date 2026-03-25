using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;

namespace TrepcaFanshopApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _service;
        public ProductsController(ProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<Product>> GetAll() => _service.GetAll();

        [HttpGet("{id}")]
        public ActionResult<Product?> GetById(int id)
        {
            var product = _service.GetById(id);
            if (product == null) return NotFound();
            return product;
        }

        [HttpPost]
        public IActionResult Add(Product product)
        {
            _service.Add(product);
            return Ok();
        }
    }
}
