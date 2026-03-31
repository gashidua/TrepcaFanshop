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

        [HttpGet]
        public ActionResult<List<Basket>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<Basket?> GetById(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public IActionResult Add(Basket basket)
        {
            _service.Add(basket);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Basket basket)
        {
            if (id != basket.Id) return BadRequest();
            _service.Update(basket);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return Ok();
        }

        // 🔥 TOTAL endpoint
        [HttpGet("total")]
        public IActionResult Total()
        {
            return Ok(_service.GetTotal());
        }
    }
}