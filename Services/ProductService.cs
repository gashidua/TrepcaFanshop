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

        public ProductService(IRepository<Product> repo)
        {
            _repo = repo;
        }

        public List<Product> GetAll() => _repo.GetAll();
        public Product? GetById(int id) => _repo.GetById(id);

        public void Add(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Emri i produktit nuk mund të jetë bosh");
            if (product.Price <= 0)
                throw new Exception("Çmimi duhet të jetë më i madh se 0");

            _repo.Add(product);
        }

        public void Update(Product product)
        {
            if (_repo.GetById(product.Id) == null)
                throw new Exception("Produkt nuk ekziston");
            _repo.Update(product);
        }

        public void Delete(int id)
        {
            if (_repo.GetById(id) == null)
                throw new Exception("Produkt nuk ekziston");
            _repo.Delete(id);
        }

        public List<Product> Search(string keyword)
        {
            var all = _repo.GetAll();
            if (string.IsNullOrWhiteSpace(keyword)) return all;
            keyword = keyword.ToLower();
            return all.Where(p => p.Name.ToLower().Contains(keyword) || p.Category.ToLower().Contains(keyword)).ToList();
        }

        public (decimal total, decimal average, decimal min, decimal max, int count) GetStats()
        {
            var all = _repo.GetAll();
            if (!all.Any()) return (0, 0, 0, 0, 0);

            decimal total = all.Sum(p => p.Price);
            decimal avg = all.Average(p => p.Price);
            decimal min = all.Min(p => p.Price);
            decimal max = all.Max(p => p.Price);
            int count = all.Count;

            return (total, avg, min, max, count);
        }

        public void ExportToFile(string path, List<Product> products, string? note = null)
        {
            using var writer = new StreamWriter(path);
            if (!string.IsNullOrWhiteSpace(note)) writer.WriteLine(note);

            writer.WriteLine("Id,Name,Type,Price,Size,Stock,Category");
            foreach (var p in products)
            {
                writer.WriteLine($"{p.Id},{p.Name},{p.Type},{p.Price},{p.Size},{p.Stock},{p.Category}");
            }

            var stats = GetStats();
            writer.WriteLine($"Totali: {stats.total}, Mesatarja: {stats.average}, Min: {stats.min}, Max: {stats.max}, Numri: {stats.count}");
        }
    }
}