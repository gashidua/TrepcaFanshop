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
<<<<<<< HEAD
            return items.FirstOrDefault(x => ((dynamic)x).Id == id);
=======

            var idProp = typeof(T).GetProperty("Id");

            var obj = items.FirstOrDefault(x =>
                (int)idProp.GetValue(x) == id);

            return obj;
        }

        public virtual void Update(T updatedItem)
        {
            LoadFromFile();

            var idProp = typeof(T).GetProperty("Id");

            var existing = items.FirstOrDefault(x =>
                (int)idProp.GetValue(x) == (int)idProp.GetValue(updatedItem));

            if (existing != null)
            {
                var index = items.IndexOf(existing);
                items[index] = updatedItem;
                Save();
            }
        }

        public virtual void Delete(int id)
        {
            LoadFromFile();

            var idProp = typeof(T).GetProperty("Id");

            var item = items.FirstOrDefault(x =>
                (int)idProp.GetValue(x) == id);

            if (item != null)
            {
                items.Remove(item);
                Save();
            }
>>>>>>> fix-project
        }

        public void Save()
        {
            using var writer = new StreamWriter(filePath);

            var props = typeof(T).GetProperties();
            writer.WriteLine(string.Join(",", props.Select(p => p.Name)));

            foreach (var item in items)
            {
<<<<<<< HEAD
                var values = props.Select(p => p.GetValue(item)?.ToString() ?? "");
                writer.WriteLine(string.Join(",", values));
=======
                var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

                // Header
                writer.WriteLine(string.Join(",", props.Select(p => p.Name)));

                foreach (var item in items)
                {
                    var values = props.Select(p => p.GetValue(item)?.ToString() ?? "");
                    writer.WriteLine(string.Join(",", values));
                }
>>>>>>> fix-project
            }
        }

        private void LoadFromFile()
        {
            if (!File.Exists(filePath)) return;

            items.Clear();
            var lines = File.ReadAllLines(filePath);
<<<<<<< HEAD
            if (lines.Length < 2) return;
=======

            if (lines.Length < 2)
                return;
>>>>>>> fix-project

            var headers = lines[0].Split(',');
            var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            for (int i = 1; i < lines.Length; i++)
            {
                var values = lines[i].Split(',');

                var obj = new T();
<<<<<<< HEAD
                var props = typeof(T).GetProperties();
=======
>>>>>>> fix-project

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
    }
}