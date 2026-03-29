using System.Collections.Generic;
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

        public List<Product> List(string? type = null)
        {
            var products = _repo.GetAll();
            if (!string.IsNullOrEmpty(type))
                products = products.Where(p => p.Type.Equals(type, StringComparison.OrdinalIgnoreCase)).ToList();
            return products;
        }

        public Product? GetById(int id) => _repo.GetById(id);

        public void Add(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Emri i produktit nuk mund të jetë bosh");

            if (product.Price <= 0)
                throw new Exception("Çmimi duhet të jetë më i madh se 0");

            _repo.Add(product);
        }

        public void Update(Product product) => _repo.Update(product);

        public void Delete(int id) => _repo.Delete(id);

        internal IEnumerable<object> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}
