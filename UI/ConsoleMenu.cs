using System;
using System.Linq;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using System.Collections.Generic;

namespace TrepcaFanshopApp.UI
{
    public class ConsoleMenu
    {
        private readonly ProductService _productService;

        public ConsoleMenu(ProductService productService)
        {
            _productService = productService;
        }

        public void Start()
        {
            while (true)
            {
                Console.WriteLine("\n--- TrepcaFanshop Menu ---");
                Console.WriteLine("1. Listo produktet");
                Console.WriteLine("2. Shto produkt të ri");
                Console.WriteLine("3. Gjej produkt sipas Id");
                Console.WriteLine("4. Update produkt");
                Console.WriteLine("5. Delete produkt");
                Console.WriteLine("6. Eksport rezultate");
                Console.WriteLine("7. Dil");
                Console.Write("Zgjedh opsion: ");

                var choice = Console.ReadLine();
                switch (choice)
                {
                    case "1":
                        ListAll();
                        break;
                    case "2":
                        AddProduct();
                        break;
                    case "3":
                        FindById();
                        break;
                    case "4":
                        UpdateProduct();
                        break;
                    case "5":
                        DeleteProduct();
                        break;
                    case "6":
                        ExportProducts();
                        break;
                    case "7":
                        return;
                    default:
                        Console.WriteLine("Opsion i pavlefshëm!");
                        break;
                }
            }
        }

        private void ListAll()
        {
            Console.Write("Kërko emrin/kategorinë (Enter për pa filter): ");
            var keyword = Console.ReadLine() ?? "";

            Console.Write("Filtrim sipas çmimit minimal (Enter për pa filter): ");
            decimal? minPrice = null;
            if (decimal.TryParse(Console.ReadLine(), out decimal min)) minPrice = min;

            Console.Write("Filtrim sipas çmimit maksimal (Enter për pa filter): ");
            decimal? maxPrice = null;
            if (decimal.TryParse(Console.ReadLine(), out decimal max)) maxPrice = max;

            Console.Write("Shfaq vetëm produktet me stock >0? (po/jo): ");
            bool onlyStock = Console.ReadLine()?.Trim().ToLower() == "po";

            var products = _productService.Search(keyword);

            if (minPrice.HasValue) products = products.Where(p => p.Price >= minPrice.Value).ToList();
            if (maxPrice.HasValue) products = products.Where(p => p.Price <= maxPrice.Value).ToList();
            if (onlyStock) products = products.Where(p => p.Stock > 0).ToList();

            // Sortimi
            Console.WriteLine("Sortim sipas: 1-Emër A-Z, 2-Çmim ngjitës, 3-Çmim zbritës");
            var sortChoice = Console.ReadLine();
            products = sortChoice switch
            {
                "1" => products.OrderBy(p => p.Name).ToList(),
                "2" => products.OrderBy(p => p.Price).ToList(),
                "3" => products.OrderByDescending(p => p.Price).ToList(),
                _ => products
            };

            Console.WriteLine("\nProdukte:");
            foreach (var p in products)
            {
                Console.WriteLine($"{p.Id} - {p.Name} - {p.Category} - {p.Price}€ - Stock:{p.Stock}");
            }

            if (!products.Any())
                Console.WriteLine("Nuk u gjet asnjë produkt për këtë filter.");

            // Shfaq statistika
            var stats = _productService.GetStats();
            Console.WriteLine($"\nStatistika: Totali={stats.total}, Mesatarja={stats.average}, Min={stats.min}, Max={stats.max}, Numri={stats.count}");
        }

        private void AddProduct()
        {
            try
            {
                Console.Write("Emri i produktit: ");
                var name = Console.ReadLine();
                Console.Write("Type: ");
                var type = Console.ReadLine();
                Console.Write("Çmimi: ");
                if (!decimal.TryParse(Console.ReadLine(), out decimal price) || price <= 0)
                {
                    Console.WriteLine("Ju lutem shkruani numër valid për çmimin!");
                    return;
                }

                var products = _productService.GetAll();
                int newId = products.Any() ? products.Max(p => p.Id) + 1 : 1;

                var product = new Product
                {
                    Id = newId,
                    Name = name ?? "",
                    Type = type ?? "",
                    Price = price,
                    Size = "M",
                    Stock = 10,
                    Category = "Merchandise"
                };

                _productService.Add(product);
                Console.WriteLine("Produkti u shtua me sukses!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private void FindById()
        {
            Console.Write("Shkruaj Id e produktit: ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Id i pavlefshëm!");
                return;
            }

            var product = _productService.GetById(id);
            if (product == null) Console.WriteLine("Produkt nuk u gjet.");
            else Console.WriteLine($"{product.Id} - {product.Name} - {product.Category} - {product.Price}€ - Stock:{product.Stock}");
        }

        private void UpdateProduct()
        {
            Console.Write("Shkruaj Id e produktit për Update: ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Id i pavlefshëm!");
                return;
            }

            var product = _productService.GetById(id);
            if (product == null)
            {
                Console.WriteLine("Produkt nuk ekziston.");
                return;
            }

            Console.Write($"Emri i ri ({product.Name}): ");
            var name = Console.ReadLine();
            Console.Write($"Çmimi i ri ({product.Price}): ");
            if (decimal.TryParse(Console.ReadLine(), out decimal price) && price > 0) product.Price = price;

            if (!string.IsNullOrWhiteSpace(name)) product.Name = name;

            _productService.Update(product);
            Console.WriteLine("Produkti u përditësua me sukses!");
        }

        private void DeleteProduct()
        {
            Console.Write("Shkruaj Id e produktit për Delete: ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Id i pavlefshëm!");
                return;
            }

            try
            {
                _productService.Delete(id);
                Console.WriteLine("Produkti u fshi me sukses!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private void ExportProducts()
        {
            Console.Write("Shkruaj path ku do të ruhet raporti (p.sh. raport.txt): ");
            var path = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(path)) path = "raport.txt";

            var products = _productService.GetAll();
            _productService.ExportToFile(path, products, "Raporti i produkteve");
            Console.WriteLine("Produkte eksportuan me sukses!");
        }
    }
}