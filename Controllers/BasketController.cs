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
        public ActionResult<List<Basket>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<Basket> GetById(int id)
        {
            var basket = _service.GetById(id);

            if (basket == null)
                return NotFound();

            return Ok(basket);
        }

        [HttpPost]
        public ActionResult<Basket> Add([FromBody] Basket basket)
        {
            _service.Add(basket);

            return CreatedAtAction(nameof(GetById), new { id = basket.Id }, basket);
        }
    }
}