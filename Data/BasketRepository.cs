using TrepcaFanshopApp.Models;
using System.IO;

namespace TrepcaFanshopApp.Data
{
    public class BasketRepository : FileRepository<Basket>
    {
        public BasketRepository()
            : base(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "DataFiles"))
        {
        }
    }
}