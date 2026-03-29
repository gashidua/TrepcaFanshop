using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace TrepcaFanshopApp.Data
{
    public class FileRepository<T> where T : class, new()
    {
        private readonly string filePath;
        protected List<T> items = new List<T>();

        public FileRepository()
        {
            var folder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles");
            Directory.CreateDirectory(folder);
            filePath = Path.Combine(folder, typeof(T).Name + ".csv");

            if (File.Exists(filePath))
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
            LoadFromFile();
            return items;
        }

        public T? GetById(int id)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            if (idProp == null) return null;

            return items.FirstOrDefault(x =>
            {
                var val = idProp.GetValue(x);
                return val != null && Convert.ToInt32(val) == id;
            });
        }

        public void Update(T updatedItem)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            if (idProp == null) return;

            var existing = items.FirstOrDefault(x =>
            {
                var val1 = idProp.GetValue(x);
                var val2 = idProp.GetValue(updatedItem);
                return val1 != null && val2 != null && Convert.ToInt32(val1) == Convert.ToInt32(val2);
            });

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
            if (idProp == null) return;

            var item = items.FirstOrDefault(x =>
            {
                var val = idProp.GetValue(x);
                return val != null && Convert.ToInt32(val) == id;
            });

            if (item != null)
            {
                items.Remove(item);
                Save();
            }
        }

        public void Save()
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
                    if (val != null)
                        prop.SetValue(obj, val);
                }

                items.Add(obj);
            }
        }
    }
}