using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;

namespace TrepcaFanshopApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : ControllerBase
    {
        private readonly BasketService _service;

<<<<<<< HEAD
        public BasketsController(BasketService service)
=======
        public BasketController(BasketService service)
>>>>>>> fix-project
        {
            _service = service;
        }

        // GET: api/basket
        [HttpGet]
<<<<<<< HEAD
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
=======
        public IActionResult GetAll() => Ok(_service.List());

        // POST: api/basket/add
        [HttpPost("add")]
        public IActionResult Add([FromBody] Models.BasketItem item)
        {
            try
            {
                _service.Add(item.ProductId, item.Quantity);
                return Ok(_service.List());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/basket/remove/{productId}
        [HttpDelete("remove/{productId}")]
        public IActionResult Remove(int productId)
        {
            _service.Remove(productId);
            return Ok(_service.List());
>>>>>>> fix-project
        }

        // GET: api/basket/total
        [HttpGet("total")]
        public IActionResult Total() => Ok(_service.GetTotal());
    }
}