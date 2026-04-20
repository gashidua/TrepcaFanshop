using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

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
            ValidateBasket(basket);

            var product = GetProductOrThrow(basket.ProductId);

            ValidateStock(basket.Quantity, product.Stock);

            var existing = _repo.GetAll()
                .FirstOrDefault(x => x.ProductId == basket.ProductId);

            if (existing != null)
            {
                var newQty = existing.Quantity + basket.Quantity;

                ValidateStock(newQty, product.Stock);

                existing.Quantity = newQty;
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
                ?? throw new Exception("Basket item not found");

            ValidateBasket(basket);

            var product = GetProductOrThrow(basket.ProductId);

            ValidateStock(basket.Quantity, product.Stock);

            _repo.Update(basket);
        }

        public void Delete(int id)
        {
            var existing = _repo.GetById(id)
                ?? throw new Exception("Basket item not found");

            _repo.Delete(id);
        }

        public decimal GetTotal()
        {
            var baskets = _repo.GetAll();

            var products = baskets
                .Select(b => _productService.GetById(b.ProductId))
                .Where(p => p != null)
                .ToList();

            decimal total = 0;

            foreach (var item in baskets)
            {
                var product = products.FirstOrDefault(p => p!.Id == item.ProductId);

                if (product != null)
                    total += product.Price * item.Quantity;
            }

            return total;
        }

        // ---------------- HELPERS ----------------

        private Product GetProductOrThrow(int productId)
        {
            return _productService.GetById(productId)
                ?? throw new Exception("Product not found");
        }

        private void ValidateBasket(Basket basket)
        {
            if (basket.Quantity <= 0)
                throw new Exception("Invalid quantity");
        }

        private void ValidateStock(int qty, int stock)
        {
            if (qty > stock)
                throw new Exception("Not enough stock");
        }
    }
}