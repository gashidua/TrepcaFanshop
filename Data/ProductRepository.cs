using TrepcaFanshopApp.Models;
using System.IO;

namespace TrepcaFanshopApp.Data
{
    public class ProductRepository : FileRepository<Product>
    {
        public ProductRepository()
            : base(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "DataFiles"))
        {
        }
    }
}