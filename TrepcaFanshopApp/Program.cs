using TrepcaFanshopApp.Models;
using TrepcaFanshopApp.Data;
using TrepcaFanshopApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Krijo singleton services me parameter folder path
builder.Services.AddSingleton<FileRepository<Product>>(sp => new FileRepository<Product>("DataFiles"));
builder.Services.AddSingleton<FileRepository<Basket>>(sp => new FileRepository<Basket>("DataFiles"));
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<BasketService>();

var app = builder.Build();
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();
app.Run();