using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace TrepcaFanshopApp.Data
{
    public class FileRepository<T> : IRepository<T> where T : class, new()
    {
        private readonly string filePath;
        private readonly string folderPath;
        private List<T> items = new();

        public FileRepository(string folderPath)
        {
            this.folderPath = folderPath;

            // ✅ KJO ËSHTË FIX KRYESORI
            Directory.CreateDirectory(folderPath);

            filePath = Path.Combine(folderPath, typeof(T).Name + ".csv");

            if (!File.Exists(filePath))
            {
                File.WriteAllText(filePath, "");
            }

            LoadFromFile();
        }

        public List<T> GetAll()
        {
            LoadFromFile();
            return items;
        }

        public T? GetById(int id)
        {
            LoadFromFile();

            return items.FirstOrDefault(x =>
            {
                var prop = x.GetType().GetProperty("Id");
                if (prop == null) return false;

                return (int)(prop.GetValue(x) ?? 0) == id;
            });
        }

        public void Add(T item)
        {
            LoadFromFile();
            items.Add(item);
            SaveToFile();
        }

        public void Update(T item)
        {
            LoadFromFile();

            var prop = item.GetType().GetProperty("Id");
            if (prop == null) return;

            var id = (int)(prop.GetValue(item) ?? 0);

            var existing = GetById(id);
            if (existing == null) return;

            var index = items.IndexOf(existing);
            items[index] = item;

            SaveToFile();
        }

        public void Delete(int id)
        {
            LoadFromFile();

            var item = GetById(id);
            if (item == null) return;

            items.Remove(item);
            SaveToFile();
        }

        private void SaveToFile()
        {
            using var writer = new StreamWriter(filePath);

            foreach (var item in items)
            {
                var props = item.GetType().GetProperties();

                var line = string.Join(",",
                    props.Select(p => p.GetValue(item)?.ToString() ?? ""));

                writer.WriteLine(line);
            }
        }

        private void LoadFromFile()
        {
            items = new List<T>();

            if (!File.Exists(filePath))
                return;

            var lines = File.ReadAllLines(filePath);

            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                var obj = new T();
                var props = obj.GetType().GetProperties();
                var values = line.Split(',');

                for (int i = 0; i < props.Length && i < values.Length; i++)
                {
                    try
                    {
                        var converted = Convert.ChangeType(values[i], props[i].PropertyType);
                        props[i].SetValue(obj, converted);
                    }
                    catch
                    {
                        // ignore invalid values
                    }
                }

                items.Add(obj);
            }
        }
    }
}