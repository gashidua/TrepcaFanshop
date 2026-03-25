using System.Collections.Generic;

namespace TrepcaFanshopApp.Models
{
    public class Basket
    {
        public int Id { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();

        public void AddProduct(Product product)
        {
            Products.Add(product);
        }

        public void RemoveProduct(Product product)
        {
            Products.Remove(product);
        }

        public double CalculateTotal()
        {
            double total = 0;
            foreach (var p in Products)
                total += p.Price;
            return total;
        }
    }
}