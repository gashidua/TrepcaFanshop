using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Services
{
    public class BasketService
    {
        private readonly FileRepository<Basket> _repo = new FileRepository<Basket>();

        public List<Basket> GetAll() => _repo.GetAll();
        public Basket? GetById(int id) => _repo.GetById(id);
        public void Add(Basket basket) => _repo.Add(basket);
    }
}