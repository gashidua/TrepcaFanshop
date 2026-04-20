using System;

namespace TrepcaFanshopApp.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Category { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Size { get; set; } = string.Empty;

        public int Stock { get; set; }

        public DateTime DateAdded { get; set; }

        // Default constructor (required for repository/serialization)
        public Product()
        {
            DateAdded = DateTime.UtcNow;
        }

        // Lightweight constructor (no validation inside model)
        public Product(string name, decimal price, string category)
        {
            Name = name;
            Price = price;
            Category = category;
            DateAdded = DateTime.UtcNow;
        }
    }
}