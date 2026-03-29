using TrepcaFanshopApp.Services;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<FileRepository<Product>>();   // Generic repository për Product
builder.Services.AddSingleton<ProductService>();            // Service për menaxhim produktesh
builder.Services.AddSingleton<BasketService>();             // Service për basket/shporta

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var repo = scope.ServiceProvider.GetRequiredService<FileRepository<Product>>();

    if (!repo.GetAll().Any())
    {
        repo.Add(new Product { Id = 1, Name = "Fanella Home", Type = "Fanella", Price = 25, Size = "M", Stock = 10 });
        repo.Add(new Product { Id = 2, Name = "Fanella Away", Type = "Fanella", Price = 25, Size = "L", Stock = 8 });
        repo.Add(new Product { Id = 3, Name = "Bileta VIP", Type = "Bileta", Price = 15, Size = "N/A", Stock = 50 });
        repo.Add(new Product { Id = 4, Name = "Bileta Standard", Type = "Bileta", Price = 5, Size = "N/A", Stock = 100 });
        repo.Add(new Product { Id = 5, Name = "Kapelë Trepça", Type = "Aksesore", Price = 10, Size = "N/A", Stock = 20 });
    }
}

app.Run();