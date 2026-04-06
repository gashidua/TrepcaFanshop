using System;
using System.IO;
using System.Linq;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Services;
using Xunit;

namespace TrepcaFanshop.Tests
{
    public class TestProducts : IDisposable
    {
        private readonly string testFolder = "TestData";
        private readonly FileRepository<Product> repo;
        private readonly ProductService service;

        public TestProducts()
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

        [Fact]
        public void Add_ValidProduct_Success()
        {
            var product = new Product { Id = 1, Name = "Fanella", Category = "Merch", Price = 15, Type = "Fanella", Size = "M", Stock = 10 };
            service.Add(product);

            var all = service.GetAll();
            Assert.Single(all);
            Assert.Equal("Fanella", all[0].Name);
        }

        [Fact]
        public void Add_EmptyName_ThrowsException()
        {
            var product = new Product { Id = 1, Name = "", Category = "Merch", Price = 10 };
            var ex = Assert.Throws<Exception>(() => service.Add(product));
            Assert.Equal("Emri i produktit nuk mund të jetë bosh", ex.Message);
        }

        [Fact]
        public void Search_ExistingAndNonExisting()
        {
            var product1 = new Product { Id = 1, Name = "Fanella", Category = "Merch", Price = 15 };
            var product2 = new Product { Id = 2, Name = "Bileta", Category = "Event", Price = 5 };

            service.Add(product1);
            service.Add(product2);

            var result1 = service.Search("Fanella");
            Assert.Single(result1);
            Assert.Equal("Fanella", result1[0].Name);

            var result2 = service.Search("NukEkziston");
            Assert.Empty(result2);
        }

        [Fact]
        public void GetStats_CorrectCalculation()
        {
            service.Add(new Product { Id = 1, Name = "Fanella", Category = "Merch", Price = 10 });
            service.Add(new Product { Id = 2, Name = "Bileta", Category = "Event", Price = 20 });

            var stats = service.GetStats();

            Assert.Equal(30m, stats.total);
            Assert.Equal(15m, stats.average);
            Assert.Equal(10m, stats.min);
            Assert.Equal(20m, stats.max);
            Assert.Equal(2, stats.count);
        }
    }
}