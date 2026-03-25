using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using TrepcaFanshopApp.Data;

namespace TrepcaFanshopApp.Data
{
    public class FileRepository<T> : IRepository<T> where T : class, new()
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

        public virtual void Add(T item)
        {
            items.Add(item);
            Save();
        }

        public virtual List<T> GetAll()
        {
            LoadFromFile();
            return items;
        }

        public virtual T? GetById(int id)
        {
            LoadFromFile();
            dynamic? obj = items.FirstOrDefault(x => ((dynamic)x).Id == id);
            return (T?)obj;
        }

        public virtual void Save()
        {
            using (var writer = new StreamWriter(filePath))
            {
                var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

                writer.WriteLine(string.Join(",", props.Select(p => p.Name)));

                foreach (var item in items)
                {
                    var values = props.Select(p => p.GetValue(item)?.ToString() ?? "");
                    writer.WriteLine(string.Join(",", values));
                }
            }
        }

        private void LoadFromFile()
        {
            if (!File.Exists(filePath))
                return;

            items.Clear();
            var lines = File.ReadAllLines(filePath);
            if (lines.Length < 2)
                return;

            var headers = lines[0].Split(',');

            for (int i = 1; i < lines.Length; i++)
            {
                var values = lines[i].Split(',');
                var obj = new T();
                var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

                for (int j = 0; j < headers.Length; j++)
                {
                    var prop = props.FirstOrDefault(p => p.Name == headers[j]);
                    if (prop == null) continue;

                    var convertedValue = Convert.ChangeType(values[j], prop.PropertyType);
                    prop.SetValue(obj, convertedValue);
                }

                items.Add(obj);
            }
        }
    }
}