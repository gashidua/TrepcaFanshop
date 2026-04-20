using System;
using System.Collections.Generic;
using System.Linq;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Services
{
    public class ProductService
    {
        private readonly IRepository<Product> _repo;
        private FileRepository<Product> repo;

        public ProductService(IRepository<Product> repo)
        {
            _repo = repo;
        }

        public ProductService(FileRepository<Product> repo)
        {
            this.repo = repo;
        }

        public List<Product> GetAll() => _repo.GetAll();

        public Product? GetById(int id) => _repo.GetById(id);

        public void Add(Product product)
        {
            Validate(product);
            _repo.Add(product);
        }

        public void Update(Product product)
        {
            var existing = _repo.GetById(product.Id);
            if (existing == null)
                throw new Exception("Product not found");

            Validate(product);
            _repo.Update(product);
        }

        public void Delete(int id)
        {
            var existing = _repo.GetById(id);
            if (existing == null)
                throw new Exception("Product not found");

            _repo.Delete(id);
        }

        public List<Product> Search(string keyword)
        {
            var all = _repo.GetAll();

            if (string.IsNullOrWhiteSpace(keyword))
                return all;

            keyword = keyword.ToLower();

            return all.Where(p =>
                p.Name.ToLower().Contains(keyword) ||
                p.Category.ToLower().Contains(keyword)
            ).ToList();
        }

        public List<Product> FilterByPrice(decimal minPrice)
        {
            return _repo.GetAll()
                .Where(p => p.Price >= minPrice)
                .ToList();
        }

        public (decimal total, decimal average, decimal min, decimal max, int count) GetStats()
        {
            var all = _repo.GetAll();

            if (!all.Any())
                return (0, 0, 0, 0, 0);

            return (
                all.Sum(p => p.Price),
                all.Average(p => p.Price),
                all.Min(p => p.Price),
                all.Max(p => p.Price),
                all.Count
            );
        }

        private void Validate(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Name is required");

            if (product.Price <= 0)
                throw new Exception("Price must be greater than 0");
        }
    }
}