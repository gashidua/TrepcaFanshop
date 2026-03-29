using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Services
{
    public class ProductServiceBase
    {
        private readonly FileRepository<Product> _repo;

        public ProductServiceBase(FileRepository<Product> repo)
        {
            _repo = repo;
        }

        // Shto produkt
        public void Add(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Emri i produktit nuk mund të jetë bosh");

            if (product.Price <= 0)
                throw new Exception("Çmimi duhet të jetë më i madh se 0");

            _repo.Add(product);
        }

        // Fshi produkt sipas ID
        public void Delete(int id)
        {
            var product = _repo.GetById(id);
            if (product == null)
                throw new Exception("Produkt nuk ekziston");

            _repo.Delete(id);
        }

        // Merr produkt sipas ID
        public Product? GetById(int id) => _repo.GetById(id);

        // Listo produktet me filter opsional për type
        public List<Product> List(string? type = null)
        {
            var products = _repo.GetAll();
            if (!string.IsNullOrEmpty(type))
                products = products
                    .Where(p => p.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            return products;
        }

        // Përditëso produktin ekzistues
        public void Update(Product updatedProduct)
        {
            var existing = _repo.GetById(updatedProduct.Id);
            if (existing == null)
                throw new Exception("Produkt nuk ekziston");

            existing.Name = updatedProduct.Name;
            existing.Price = updatedProduct.Price;
            existing.Category = updatedProduct.Category;
            _repo.Update(existing);
        }

        // Merr të gjitha produktet
        public List<Product> GetAll() => _repo.GetAll();
    }
}