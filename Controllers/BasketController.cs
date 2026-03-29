using Microsoft.AspNetCore.Mvc;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using System;
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
        public IActionResult GetAll()
        {
            var items = _service.List();
            return Ok(items);
        }

        // POST: api/basket/add
        [HttpPost("add")]
        public IActionResult Add([FromBody] BasketItem item)
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
        public IActionResult Total()
        {
            var total = _service.GetTotal();
            return Ok(total);
        }
    }
}