using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using TrepcaFanshopApp.Models;

namespace TrepcaFanshopApp.Data
{
    public class FileRepository<T> : IRepository<T> where T : class, new()
    {
        private readonly string filePath;
        private readonly List<T> items = new List<T>();

        public FileRepository(string folderPath)
        {
            Directory.CreateDirectory(folderPath);
            filePath = Path.Combine(folderPath, typeof(T).Name + ".csv");

            if (!File.Exists(filePath))
                Save();
            else
                LoadFromFile();
        }

        public void Add(T item)
        {
            LoadFromFile();
            items.Add(item);
            Save();
        }

        public List<T> GetAll()
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    Console.WriteLine("File nuk u gjet, po krijoj file të ri...");
                    Save();
                }

                LoadFromFile();
                return items;
            }
            catch
            {
                Console.WriteLine("Gabim gjatë leximit të file");
                return new List<T>();
            }
        }

        public T? GetById(int id)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            return items.FirstOrDefault(x => (int)idProp!.GetValue(x)! == id);
        }

        public void Update(T updatedItem)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            var existing = items.FirstOrDefault(x => (int)idProp!.GetValue(x)! == (int)idProp.GetValue(updatedItem)!);
            if (existing != null)
            {
                var index = items.IndexOf(existing);
                items[index] = updatedItem;
                Save();
            }
        }

        public void Delete(int id)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            var item = items.FirstOrDefault(x => (int)idProp!.GetValue(x)! == id);
            if (item != null)
            {
                items.Remove(item);
                Save();
            }
        }

        private void Save()
        {
            var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            using var writer = new StreamWriter(filePath);
            writer.WriteLine(string.Join(",", props.Select(p => p.Name)));

            foreach (var item in items)
            {
                var values = props.Select(p => p.GetValue(item)?.ToString() ?? "");
                writer.WriteLine(string.Join(",", values));
            }
        }

        private void LoadFromFile()
        {
            if (!File.Exists(filePath)) return;
            items.Clear();

            var lines = File.ReadAllLines(filePath);
            if (lines.Length < 2) return;

            var headers = lines[0].Split(',');
            var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            for (int i = 1; i < lines.Length; i++)
            {
                var values = lines[i].Split(',');
                var obj = new T();
                for (int j = 0; j < headers.Length; j++)
                {
                    var prop = props.FirstOrDefault(p => p.Name == headers[j]);
                    if (prop == null) continue;

                    var val = Convert.ChangeType(values[j], prop.PropertyType);
                    prop.SetValue(obj, val);
                }
                items.Add(obj);
            }
        }

        public void ExportProducts(string path, List<Product> products, string? note = null)
        {
            try
            {
                using var writer = new StreamWriter(path);

                if (!string.IsNullOrWhiteSpace(note))
                    writer.WriteLine(note);

                writer.WriteLine("Id,Name,Type,Price,Size,Stock,Category");

                foreach (var p in products)
                {
                    writer.WriteLine($"{p.Id},{p.Name},{p.Type},{p.Price},{p.Size},{p.Stock},{p.Category}");
                }
            }
            catch
            {
                Console.WriteLine("Gabim gjatë shkrimit në file");
            }
        }

    }
}