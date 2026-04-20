using System;
using System.IO;
using Xunit;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using TrepcaFanshopApp.Data;

namespace TrepcaFanshop.Tests
{
    public class ProductServiceTests : IDisposable
    {
        private readonly string testFolder = "TestData";
        private readonly FileRepository<Product> repo;
        private readonly ProductService service;

        public ProductServiceTests()
        {
            if (Directory.Exists(testFolder))
                Directory.Delete(testFolder, true);

            repo = new FileRepository<Product>(testFolder);
            service = new ProductService(repo);
        }

        public void Dispose()
        {
            if (Directory.Exists(testFolder))
                Directory.Delete(testFolder, true);
        }

        // ---------------- CREATE TEST ----------------
        [Fact]
        public void Add_Product_ShouldBeAddedSuccessfully()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Fanella",
                Category = "Merch",
                Price = 15,
                Type = "T-Shirt",
                Size = "M",
                Stock = 10
            };

            service.Add(product);

            var all = service.GetAll();

            Assert.Single(all);
            Assert.Equal("Fanella", all[0].Name);
        }

        // ---------------- INVALID INPUT TEST ----------------
        [Fact]
        public void Add_InvalidProduct_ShouldThrowException()
        {
            var product = new Product
            {
                Id = 1,
                Name = "",
                Category = "Merch",
                Price = 10
            };

            Assert.Throws<Exception>(() => service.Add(product));
        }

        // ---------------- GET BY ID TEST ----------------
        [Fact]
        public void GetById_ShouldReturnCorrectProduct()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Test Product",
                Category = "Merch",
                Price = 15,
                Type = "T-Shirt",
                Size = "L",
                Stock = 10
            };

            service.Add(product);

            var result = service.GetById(1);

            Assert.NotNull(result);
            Assert.Equal("Test Product", result.Name);
        }

        // ---------------- UPDATE TEST ----------------
        [Fact]
        public void Update_Product_ShouldChangeValues()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Old Name",
                Category = "Merch",
                Price = 10,
                Type = "T-Shirt",
                Size = "M",
                Stock = 5
            };

            service.Add(product);

            product.Name = "New Name";
            product.Price = 25;

            service.Update(product);

            var result = service.GetById(1);

            Assert.Equal("New Name", result.Name);
            Assert.Equal(25, result.Price);
        }

        // ---------------- DELETE TEST ----------------
        [Fact]
        public void Delete_Product_ShouldRemoveIt()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Fanella",
                Category = "Merch",
                Price = 10,
                Type = "T-Shirt",
                Size = "M",
                Stock = 5
            };

            service.Add(product);

            service.Delete(1);

            Assert.Empty(service.GetAll());
        }

        // ---------------- SEARCH TEST ----------------
        [Fact]
        public void Search_ShouldReturnCorrectResult()
        {
            service.Add(new Product
            {
                Id = 1,
                Name = "Fanella Trepca",
                Category = "Merch",
                Price = 10
            });

            service.Add(new Product
            {
                Id = 2,
                Name = "Bileta",
                Category = "Event",
                Price = 5
            });

            var result = service.Search("Fanella");

            Assert.Single(result);
            Assert.Equal("Fanella Trepca", result[0].Name);
        }

        // ---------------- FILTER TEST ----------------
        [Fact]
        public void FilterByPrice_ShouldReturnCorrectProducts()
        {
            service.Add(new Product { Id = 1, Name = "A", Category = "M", Price = 5 });
            service.Add(new Product { Id = 2, Name = "B", Category = "M", Price = 20 });

            var result = service.FilterByPrice(10);

            Assert.Single(result);
            Assert.Equal(20, result[0].Price);
        }

        // ---------------- STATS TEST ----------------
        [Fact]
        public void GetStats_ShouldReturnCorrectValues()
        {
            service.Add(new Product { Id = 1, Name = "A", Category = "M", Price = 10 });
            service.Add(new Product { Id = 2, Name = "B", Category = "M", Price = 20 });

            var stats = service.GetStats();

            Assert.Equal(30m, stats.total);
            Assert.Equal(15m, stats.average);
            Assert.Equal(10m, stats.min);
            Assert.Equal(20m, stats.max);
            Assert.Equal(2, stats.count);
        }
    }
}