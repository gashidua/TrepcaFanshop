using System.Collections.Generic;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Models
{
    public class Basket
    {
        public int Id { get; set; }
        public List<Product> Products { get; set; } = new();

        public double CalculateTotal()
        {
            return Products.Sum(p => p.Price);
        }
    }
}