using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IRepository<Product>>(sp =>
    new FileRepository<Product>("DataFiles"));

builder.Services.AddScoped<IRepository<Basket>>(sp =>
    new FileRepository<Basket>("DataFiles"));

// Services
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<BasketService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();