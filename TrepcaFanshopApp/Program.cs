using TrepcaFanshopApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Regjistro shërbimet
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<BasketService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// **Sigurohu që përdor këto**
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers(); // Kjo aktivizon controllerët

app.Run();
