using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;

namespace TrepcaFanshopApp.UI
{
    public class ConsoleMenu
    {
        private readonly ProductService _service;

        public ConsoleMenu(ProductService service)
        {
            _service = service;
        }

        public void Start()
        {
            while (true)
            {
                Console.WriteLine("\n--- MENU ---");
                Console.WriteLine("1. List");
                Console.WriteLine("2. Add");
                Console.WriteLine("3. Get by ID");
                Console.WriteLine("4. Update");
                Console.WriteLine("5. Delete");
                Console.WriteLine("6. Exit");

                var choice = Console.ReadLine();

                try
                {
                    switch (choice)
                    {
                        case "1":
                            List();
                            break;

                        case "2":
                            Add();
                            break;

                        case "3":
                            GetById();
                            break;

                        case "4":
                            Update();
                            break;

                        case "5":
                            Delete();
                            break;

                        case "6":
                            return;

                        default:
                            Console.WriteLine("Invalid option");
                            break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }

        private void List()
        {
            var products = _service.GetAll();

            if (!products.Any())
            {
                Console.WriteLine("No products");
                return;
            }

            foreach (var p in products)
                Console.WriteLine($"{p.Id} - {p.Name} - {p.Price}");
        }

        private void Add()
        {
            Console.Write("Name: ");
            var name = Console.ReadLine();

            Console.Write("Price: ");
            decimal.TryParse(Console.ReadLine(), out decimal price);

            var product = new Product
            {
                Name = name ?? "",
                Price = price
            };

            _service.Add(product);
            Console.WriteLine("Added!");
        }

        private void GetById()
        {
            Console.Write("ID: ");
            int.TryParse(Console.ReadLine(), out int id);

            var p = _service.GetById(id);

            if (p == null)
            {
                Console.WriteLine("Not found");
                return;
            }

            Console.WriteLine($"{p.Id} - {p.Name} - {p.Price}");
        }

        private void Update()
        {
            Console.Write("ID: ");
            int.TryParse(Console.ReadLine(), out int id);

            var existing = _service.GetById(id);

            if (existing == null)
            {
                Console.WriteLine("Not found");
                return;
            }

            Console.Write("Name: ");
            var name = Console.ReadLine();

            Console.Write("Price: ");
            decimal.TryParse(Console.ReadLine(), out decimal price);

            if (!string.IsNullOrWhiteSpace(name))
                existing.Name = name;

            if (price > 0)
                existing.Price = price;

            _service.Update(existing);

            Console.WriteLine("Updated!");
        }

        private void Delete()
        {
            Console.Write("ID: ");
            int.TryParse(Console.ReadLine(), out int id);

            _service.Delete(id);

            Console.WriteLine("Deleted!");
        }
    }
}