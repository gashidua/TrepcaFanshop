namespace TrepcaFanshopApp.Models
{
    public class BasketItem
    {
        public int ProductId { get; set; }           // Id e produktit
        public string Name { get; set; } = "";       // Emri i produktit
        public decimal Price { get; set; }           // Çmimi i produktit
        public int Quantity { get; set; }            // Sasia e produktit në shportë
    }
}
