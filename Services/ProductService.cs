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

        public List<Product> GetAll(string? category = null)
        {
            var products = _repo.GetAll();
            if (!string.IsNullOrWhiteSpace(category))
            {
                products = products.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            return products;
        }

        public Product? GetById(int id)
        {
            return _repo.GetById(id);
        }

        public void Add(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Emri i produktit nuk mund të jetë bosh");
            if (product.Price <= 0)
                throw new Exception("Çmimi duhet të jetë më i madh se 0");

            _repo.Add(product);
        }

        public void Update(Product updatedProduct)
        {
            var existing = _repo.GetById(updatedProduct.Id);
            if (existing == null) throw new Exception("Produkt nuk ekziston");

            _repo.Update(updatedProduct);
        }

        public void Delete(int id)
        {
            var product = _repo.GetById(id);
            if (product == null) throw new Exception("Produkt nuk ekziston");

            _repo.Delete(id);
        }
    }
}