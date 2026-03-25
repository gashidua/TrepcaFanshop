using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;

namespace TrepcaFanshopApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketsController : ControllerBase
    {
        private readonly BasketService _service;
        public BasketsController(BasketService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<Basket>> GetAll() => _service.GetAll();

        [HttpGet("{id}")]
        public ActionResult<Basket?> GetById(int id)
        {
            var basket = _service.GetById(id);
            if (basket == null) return NotFound();
            return basket;
        }

        [HttpPost]
        public IActionResult Add(Basket basket)
        {
            _service.Add(basket);
            return Ok();
        }
    }
}
