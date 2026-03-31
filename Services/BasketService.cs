using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Data;

namespace TrepcaFanshopApp.Services
{
    public class BasketService
    {
        private readonly FileRepository<Basket> _repo;
        private readonly ProductService _productService;

        public BasketService(FileRepository<Basket> repo, ProductService productService)
        {
            _repo = repo;
            _productService = productService;
        }

        // ✅ Merr krejt basket items
        public List<Basket> GetAll()
        {
            return _repo.GetAll();
        }

        // ✅ Merr sipas ID
        public Basket? GetById(int id)
        {
            return _repo.GetById(id);
        }

        // 🔥 ADD (me validime + mos me leju duplicate)
        public void Add(Basket basket)
        {
            var product = _productService.GetById(basket.ProductId);

            if (product == null)
                throw new Exception("Produkti nuk ekziston");

            if (basket.Quantity <= 0)
                throw new Exception("Sasia duhet të jetë më shumë se 0");

            if (basket.Quantity > product.Stock)
                throw new Exception($"Vetëm {product.Stock} njësi në stok");

            // kontrollo nëse ekziston në basket
            var existing = _repo.GetAll()
                .FirstOrDefault(x => x.ProductId == basket.ProductId);

            if (existing != null)
            {
                // nëse ekziston → rrit quantity
                var newQuantity = existing.Quantity + basket.Quantity;

                if (newQuantity > product.Stock)
                    throw new Exception($"Vetëm {product.Stock} njësi në stok");

                existing.Quantity = newQuantity;
                _repo.Update(existing);
            }
            else
            {
                _repo.Add(basket);
            }
        }

        // ✅ UPDATE
        public void Update(Basket basket)
        {
            var existing = _repo.GetById(basket.Id);
            if (existing == null)
                throw new Exception("Item nuk ekziston");

            if (basket.Quantity <= 0)
                throw new Exception("Sasia duhet të jetë më shumë se 0");

            var product = _productService.GetById(basket.ProductId);
            if (product == null)
                throw new Exception("Produkti nuk ekziston");

            if (basket.Quantity > product.Stock)
                throw new Exception("Nuk ka mjaftueshëm stok");

            _repo.Update(basket);
        }

        // ✅ DELETE
        public void Delete(int id)
        {
            var existing = _repo.GetById(id);
            if (existing == null)
                throw new Exception("Item nuk ekziston");

            _repo.Delete(id);
        }

        // 💰 TOTAL
        public decimal GetTotal()
        {
            var items = _repo.GetAll();
            decimal total = 0;

            foreach (var item in items)
            {
                var product = _productService.GetById(item.ProductId);
                if (product != null)
                {
                    total += (decimal)product.Price * item.Quantity;
                }
            }

            return total;
        }
    }
}