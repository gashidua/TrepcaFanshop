using System;

namespace TrepcaFanshopApp.Services
{
    public class Login
    {
        public void SignIn(string username, string password) => Console.WriteLine($"User {username} signed in!");
    }
}