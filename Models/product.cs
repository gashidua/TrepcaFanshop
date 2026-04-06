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
        public decimal Price { get; set; }

        // Kategoria e produktit, nuk mund të jetë null
        public string Category { get; set; } = string.Empty;

        // Lloji i produktit (Fanella, Bileta, Aksesore)
        public string Type { get; set; } = string.Empty;

        // Madhësia e produktit (S, M, L ose N/A për bileta)
        public string Size { get; set; } = string.Empty;

        // Sasia në stock
        public int Stock { get; set; }

        // Data kur u shtua produkti
        public DateTime DateAdded { get; set; } = DateTime.Now;

        // Konstruktor default
        public Product() { }

        // Konstruktor me parametra për lehtësi krijimi
        public Product(int id, string name, decimal price, string category, string type = "", string size = "", int stock = 0)
        {
            Id = id;
            Name = name ?? "Produkt pa emër";
            Price = price;
            Category = category ?? "Pa kategori";
            Type = type ?? "";
            Size = size ?? "";
            Stock = stock;
            DateAdded = DateTime.Now;
        }
    }
}