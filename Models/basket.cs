using System.Collections.Generic;
using System.Linq;

namespace TrepcaFanshopApp.Models
{
    public class Basket
    {
        // Lista e artikujve të shportës
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        // Shto artikull në shportë
        public void AddItem(BasketItem item)
        {
            var existing = Items.FirstOrDefault(x => x.ProductId == item.ProductId);
            if (existing != null)
            {
                existing.Quantity += item.Quantity;
            }
            else
            {
                Items.Add(item);
            }
        }

        // Fshi artikull nga shporta
        public void RemoveItem(int productId)
        {
            var existing = Items.FirstOrDefault(x => x.ProductId == productId);
            if (existing != null)
                Items.Remove(existing);
        }

        // Llogarit total të shportës
        public double GetTotal()
        {
            return Items.Sum(x => x.Price * x.Quantity);
        }
    }
}