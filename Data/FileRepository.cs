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

        public FileRepository(string folderPath)
        {
            Directory.CreateDirectory(folderPath);
            filePath = Path.Combine(folderPath, typeof(T).Name + ".csv");
            if (File.Exists(filePath))
                LoadFromFile();
        }

        // Shto objekt
        public void Add(T item)
        {
            LoadFromFile();
            items.Add(item);
            Save();
        }

        // Merr të gjithë objektet
        public List<T> GetAll()
        {
            LoadFromFile();
            return items;
        }

        // Merr objekt sipas Id
        public T? GetById(int id)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            if (idProp == null) return null;
            return items.FirstOrDefault(x => (int)idProp.GetValue(x)! == id);
        }

        // Update objekt
        public void Update(T updatedItem)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            if (idProp == null) return;

            var existing = items.FirstOrDefault(x => (int)idProp.GetValue(x)! == (int)idProp.GetValue(updatedItem)!);
            if (existing != null)
            {
                var index = items.IndexOf(existing);
                items[index] = updatedItem;
                Save();
            }
        }

        // Fshi objekt sipas Id
        public void Delete(int id)
        {
            LoadFromFile();
            var idProp = typeof(T).GetProperty("Id");
            if (idProp == null) return;

            var item = items.FirstOrDefault(x => (int)idProp.GetValue(x)! == id);
            if (item != null)
            {
                items.Remove(item);
                Save();
            }
        }

        // Ruaj në CSV
        public void Save()
        {
            var props = typeof(T).GetProperties();
            using var writer = new StreamWriter(filePath);

            // Header
            writer.WriteLine(string.Join(",", props.Select(p => p.Name)));

            // Vlera
            foreach (var item in items)
            {
                var values = props.Select(p => p.GetValue(item)?.ToString() ?? "");
                writer.WriteLine(string.Join(",", values));
            }
        }

        // Load nga CSV
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

                    object? val = null;
                    var propType = prop.PropertyType;

                    if (propType == typeof(int))
                        val = int.TryParse(values[j], out int intVal) ? intVal : 0;
                    else if (propType == typeof(double))
                        val = double.TryParse(values[j], out double dblVal) ? dblVal : 0;
                    else
                        val = values[j];

                    prop.SetValue(obj, val);
                }

                items.Add(obj);
            }
        }
    }
}