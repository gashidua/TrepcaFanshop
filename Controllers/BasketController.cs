using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using System.Collections.Generic;

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
        public ActionResult<List<BasketItem>> GetAll()
        {
            var items = _service.GetAll();
            return Ok(items);
        }

        // GET: api/basket/{id}
        [HttpGet("{id}")]
        public ActionResult<BasketItem?> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/basket/add
        [HttpPost("add")]
        public IActionResult Add(int productId, int quantity)
        {
            _service.Add(productId, quantity);
            return Ok();
        }

        // GET: api/basket/total
        [HttpGet("total")]
        public IActionResult Total()
        {
            return Ok(_service.GetTotal());
        }

        // DELETE: api/basket/{id}
        [HttpDelete("{id}")]
        public IActionResult Remove(int id)
        {
            _service.Remove(id);
            return Ok();
        }
    }
}