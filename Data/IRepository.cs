using System.Collections.Generic;

namespace TrepcaFanshopApp.Data
{
    public interface IRepository<T> where T : class
    {
        List<T> GetAll();
        T? GetById(int id);
        void Add(T item);
        void Save();
    }
}