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

        public BasketController(BasketService service)
        {
            _service = service;
        }

        // GET: api/basket
        [HttpGet]
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
        }

        // GET: api/basket/total
        [HttpGet("total")]
        public IActionResult Total() => Ok(_service.GetTotal());
    }
}