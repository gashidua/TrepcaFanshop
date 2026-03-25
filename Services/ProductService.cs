using System.Collections.Generic;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Services
{
    public class ProductService
    {
        private readonly FileRepository<Product> _repo = new FileRepository<Product>();

        public List<Product> GetAll() => _repo.GetAll();
        public Product? GetById(int id) => _repo.GetById(id);
        public void Add(Product product) => _repo.Add(product);
    }
}
