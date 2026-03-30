using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Services
{
    public class ProductService
    {
        private readonly FileRepository<Product> _repo;

        public ProductService(FileRepository<Product> repo)
        {
            _repo = repo;
        }

        // Merr të gjitha produktet, opsionalisht filtron sipas kategori
        public List<Product> GetAll(string? category = null)
        {
            var products = _repo.GetAll();

            if (!string.IsNullOrWhiteSpace(category))
            {
                products = products
                    .Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            return products;
        }

        // Merr produkt sipas Id
        public Product? GetById(int id)
        {
            return _repo.GetById(id);
        }

        // Shto produkt me validim
        public void Add(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Emri i produktit nuk mund të jetë bosh");

            if (product.Price <= 0)
                throw new Exception("Çmimi duhet të jetë më i madh se 0");

            _repo.Add(product);
        }

        // Update produkt
        public void Update(Product updatedProduct)
        {
            var existing = _repo.GetById(updatedProduct.Id);
            if (existing == null) throw new Exception("Produkt nuk ekziston");

            existing.Name = updatedProduct.Name;
            existing.Price = updatedProduct.Price;
            existing.Type = updatedProduct.Type;
            existing.Category = updatedProduct.Category;
            existing.Size = updatedProduct.Size;
            existing.Stock = updatedProduct.Stock;

            _repo.Update(existing);
        }

        // Delete produkt
        public void Delete(int id)
        {
            var product = _repo.GetById(id);
            if (product == null) throw new Exception("Produkt nuk ekziston");

            _repo.Delete(id);
        }

        // Opsionale: List me filtrim sipas tipit
        public List<Product> List(string? type = null)
        {
            var products = _repo.GetAll();

            if (!string.IsNullOrWhiteSpace(type))
            {
                products = products
                    .Where(p => p.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            return products;
        }
    }
}