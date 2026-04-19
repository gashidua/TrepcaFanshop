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

        public bool Add(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
            {
                Console.WriteLine("Emri i produktit nuk mund të jetë bosh");
                return false;
            }

            if (product.Price <= 0)
            {
                Console.WriteLine("Çmimi duhet të jetë më i madh se 0");
                return false;
            }

            try
            {
                _repo.Add(product);
                return true;
            }
            catch
            {
                Console.WriteLine("Gabim gjatë shtimit të produktit");
                return false;
            }
        }

        public bool Update(Product product)
        {
            try
            {
                if (_repo.GetById(product.Id) == null)
                {
                    Console.WriteLine("Produkt nuk ekziston");
                    return false;
                }

                _repo.Update(product);
                return true;
            }
            catch
            {
                Console.WriteLine("Gabim gjatë përditësimit");
                return false;
            }
        }

        public bool Delete(int id)
        {
            try
            {
                if (_repo.GetById(id) == null)
                {
                    Console.WriteLine("Produkt nuk ekziston");
                    return false;
                }

                _repo.Delete(id);
                return true;
            }
            catch
            {
                Console.WriteLine("Gabim gjatë fshirjes");
                return false;
            }
        }

        public List<Product> Search(string keyword)
        {
            var all = _repo.GetAll();
            if (string.IsNullOrWhiteSpace(keyword)) return all;
            keyword = keyword.ToLower();
            return all.Where(p => p.Name.ToLower().Contains(keyword) || p.Category.ToLower().Contains(keyword)).ToList();
        }

        public List<Product> FilterByPrice(decimal minPrice)
        {
            try
            {
                return _repo.GetAll()
                    .Where(p => p.Price >= minPrice)
                    .ToList();
            }
            catch
            {
                Console.WriteLine("Gabim gjatë filtrimit");
                return new List<Product>();
            }
        }

        public List<Product> SortByPrice(bool ascending = true)
        {
            var all = _repo.GetAll();

            return ascending
                ? all.OrderBy(p => p.Price).ToList()
                : all.OrderByDescending(p => p.Price).ToList();
        }

        public (decimal total, decimal average, decimal min, decimal max, int count) GetStats()
        {
            try
            {
                var all = _repo.GetAll();

                if (all == null || !all.Any())
                    return (0, 0, 0, 0, 0);

                decimal total = all.Sum(p => p.Price);
                decimal average = all.Average(p => p.Price);
                decimal min = all.Min(p => p.Price);
                decimal max = all.Max(p => p.Price);
                int count = all.Count;

                return (total, average, min, max, count);
            }
            catch
            {
                Console.WriteLine("Gabim gjatë kalkulimit të statistikave");
                return (0, 0, 0, 0, 0);
            }
        }

        public void ExportToFile(string path, List<Product> products, string? note = null)
        {
            try
            {
                var fileRepo = _repo as FileRepository<Product>;

                if (fileRepo == null)
                {
                    Console.WriteLine("Repository nuk suporton export");
                    return;
                }

                fileRepo.ExportProducts(path, products, note);

                var stats = GetStats();

                File.AppendAllText(path,
                    $"\nTotali: {stats.total}, Mesatarja: {stats.average}, Min: {stats.min}, Max: {stats.max}, Numri: {stats.count}");
            }
            catch
            {
                Console.WriteLine("Gabim gjatë eksportit");
            }
        }
    }
}