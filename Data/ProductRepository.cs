namespace TrepcaFanshopApp.Data
{
    using TrepcaFanshopApp.Models;

    public class ProductRepository : FileRepository<Product>
    {
        public ProductRepository() : base() { }

    }
}