using System;
using System.Linq;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;

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
                Console.WriteLine("1. Listo të gjitha produktet");
                Console.WriteLine("2. Shto produkt të ri");
                Console.WriteLine("3. Gjej produkt sipas Id");
                Console.WriteLine("4. Dil");
                Console.Write("Zgjedh nje opsion: ");

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
                        return;
                    default:
                        Console.WriteLine("Opsion i pavlefshëm!");
                        break;
                }
            }
        }

        private void ListAll()
        {
            var products = _productService.List(); // ✅ FIX
            Console.WriteLine("\nProdukte:");

            foreach (var p in products)
            {
                Console.WriteLine($"Id: {p.Id}, Name: {p.Name}, Type: {p.Type}, Price: {p.Price}");
            }
        }

        private void AddProduct()
        {
            Console.Write("Emri i produktit: ");
            var name = Console.ReadLine();

            Console.Write("Type (Fanella, Bileta, Aksesore): ");
            var type = Console.ReadLine();

            Console.Write("Çmimi: ");
            var priceInput = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(name) ||
                string.IsNullOrWhiteSpace(type) ||
                !decimal.TryParse(priceInput, out decimal price) ||
                price <= 0)
            {
                Console.WriteLine("Input i pavlefshëm!");
                return;
            }

            var products = _productService.List();
            int newId = products.Count > 0 ? products.Max(p => p.Id) + 1 : 1;

            var product = new Product
            {
                Id = newId,
                Name = name,
                Type = type,
                Price = (double)price,
                Size = "M",
                Stock = 10
            };

            _productService.Add(product);
            Console.WriteLine("Produkti u shtua me sukses!");
        }

        private void FindById()
        {
            Console.Write("Shkruaj Id e produktit: ");
            var idInput = Console.ReadLine();

            if (!int.TryParse(idInput, out int id))
            {
                Console.WriteLine("Id i pavlefshëm!");
                return;
            }

            var product = _productService.GetById(id);

            if (product == null)
            {
                Console.WriteLine("Produkti nuk u gjet.");
            }
            else
            {
                Console.WriteLine($"Id: {product.Id}, Name: {product.Name}, Type: {product.Type}, Price: {product.Price}");
            }
        }
    }
}