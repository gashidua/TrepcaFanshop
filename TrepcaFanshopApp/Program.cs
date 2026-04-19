using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Swagger vetëm në dev
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddSingleton(new FileRepository<Product>("DataFiles"));
builder.Services.AddSingleton(new FileRepository<Basket>("DataFiles"));

// Services
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<BasketService>();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();