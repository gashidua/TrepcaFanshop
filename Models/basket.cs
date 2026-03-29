using System.Collections.Generic;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Models
{
    public class Basket
    {
        public int Id { get; set; }
<<<<<<< HEAD
        public List<Product> Products { get; set; } = new();
=======
        public List<Product> Products { get; set; } = new List<Product>();

        public void AddProduct(Product product) => Products.Add(product);

        public void RemoveProduct(Product product) => Products.Remove(product);
>>>>>>> fix-project

        public double CalculateTotal()
        {
            return Products.Sum(p => p.Price);
        }
    }
}