using System.Collections.Generic;

namespace TrepcaFanshopApp.Data
{
    public interface IRepository<T> where T : class, new()
    {
        void Add(T item);
        List<T> GetAll();
        T? GetById(int id);
        void Update(T item);
        void Delete(int id);
    }
}