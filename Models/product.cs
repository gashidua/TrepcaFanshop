namespace TrepcaFanshopApp.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "";       // Fanella, Bileta, Aksesore
        public string Size { get; set; } = "M";      // S, M, L ose N/A për bileta
        public double Price { get; set; }
        public int Stock { get; set; } = 10;
        public string Category { get; set; } = "Merchandise";

    }
}