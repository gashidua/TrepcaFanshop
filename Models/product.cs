using System;

namespace TrepcaFanshopApp.Models
{
    public class Product
    {
        // ID i produktit
        public int Id { get; set; }

        // Emri i produktit nuk mund të jetë null
        public string Name { get; set; } = string.Empty;

        // Çmimi i produktit
        public double Price { get; set; }

        // Kategoria e produktit, nuk mund të jetë null
        public string Category { get; set; } = string.Empty;

        // Lloji i produktit (Fanella, Bileta, Aksesore), nullable por me default string.Empty
        public string Type { get; set; } = string.Empty;

        // Madhësia e produktit (S, M, L ose N/A për bileta), nullable por me default string.Empty
        public string Size { get; set; } = string.Empty;

        // Sasia në stock
        public int Stock { get; set; }

        // Konstruktor default
        public Product() { }

        // Opsionale: konstruktor me parametra për lehtësi krijimi
        public Product(int id, string name, double price, string category, string type = "", string size = "", int stock = 0)
        {
            Id = id;
            Name = name;
            Price = price;
            Category = category;
            Type = type;
            Size = size;
            Stock = stock;
        }
    }
}