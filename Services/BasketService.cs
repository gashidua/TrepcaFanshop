using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Data;

namespace TrepcaFanshopApp.Services
{
    public class BasketService
    {
        private readonly IRepository<Basket> _repo;
        private readonly ProductService _productService;

        public BasketService(IRepository<Basket> repo, ProductService productService)
        {
            _repo = repo;
            _productService = productService;
        }

        public List<Basket> GetAll() => _repo.GetAll();
        public Basket? GetById(int id) => _repo.GetById(id);

        public void Add(Basket basket)
        {
            var product = _productService.GetById(basket.ProductId)
                ?? throw new Exception("Produkti nuk ekziston");

            if (basket.Quantity <= 0) throw new Exception("Sasia duhet të jetë më shumë se 0");
            if (basket.Quantity > product.Stock) throw new Exception($"Vetëm {product.Stock} njësi në stok");

            var existing = _repo.GetAll().FirstOrDefault(x => x.ProductId == basket.ProductId);
            if (existing != null)
            {
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

        public void Update(Basket basket)
        {
            var existing = _repo.GetById(basket.Id)
                ?? throw new Exception("Item nuk ekziston");

            var product = _productService.GetById(basket.ProductId)
                ?? throw new Exception("Produkti nuk ekziston");

            if (basket.Quantity <= 0) throw new Exception("Sasia duhet të jetë më shumë se 0");
            if (basket.Quantity > product.Stock) throw new Exception("Nuk ka mjaftueshëm stok");

            _repo.Update(basket);
        }

        public void Delete(int id)
        {
            var existing = _repo.GetById(id)
                ?? throw new Exception("Item nuk ekziston");

            _repo.Delete(id);
        }

        public decimal GetTotal()
        {
            decimal total = 0;
            foreach (var item in _repo.GetAll())
            {
                var product = _productService.GetById(item.ProductId);
                if (product != null)
                    total += product.Price * item.Quantity;
            }
            return total;
        }
    }
}