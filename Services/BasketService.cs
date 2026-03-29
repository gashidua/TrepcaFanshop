using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Services
{
    public class BasketService
    {
        private readonly List<BasketItem> _items = new List<BasketItem>();
        private readonly ProductService _productService;

        public BasketService(ProductService productService)
        {
            _productService = productService;
        }

        // Liston të gjitha artikujt e shportës
        public List<BasketItem> List() => _items;

        // Shto produkt në shportë
        public void Add(int productId, int quantity)
        {
            var product = _productService.GetById(productId);
            if (product == null)
                throw new Exception("Produkt nuk ekziston");

            if (quantity <= 0)
                throw new Exception("Sasia duhet të jetë më shumë se 0");

            if (quantity > product.Stock)
                throw new Exception($"Vetëm {product.Stock} njësi në stok");

            var existing = _items.FirstOrDefault(x => x.ProductId == productId);
            if (existing != null)
            {
                if (existing.Quantity + quantity > product.Stock)
                    throw new Exception($"Vetëm {product.Stock} njësi në stok");
                existing.Quantity += quantity;
            }
            else
            {
                _items.Add(new BasketItem
                {
                    ProductId = productId,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = quantity
                });
            }
        }

        // Fshi produkt nga shporta
        public void Remove(int productId)
        {
            var existing = _items.FirstOrDefault(x => x.ProductId == productId);
            if (existing != null)
                _items.Remove(existing);
        }

        // Llogarit total të shportës
        public decimal GetTotal() => (decimal)_items.Sum(x => x.Price * x.Quantity);
    }
}