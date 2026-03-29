using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace TrepcaFanshopApp.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Type { get; internal set; }
        public string Size { get; internal set; }
        public int Stock { get; internal set; }

        public Product() { }

        public class product
        {
            public int Id { get; set; }
            public string Name { get; set; }        // p.sh Fanella Home
            public string Type { get; set; }        // Fanella, Bileta, Aksesore
            public double Price { get; set; }
            public string Size { get; set; }        // S, M, L (ose N/A per bileta)
            public int Stock { get; set; }
        }
    }
}