using Microsoft.EntityFrameworkCore;
using YellowBook.API.Models;

namespace YellowBook.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(YellowBookDbContext db)
    {
        if (await db.Categories.AnyAsync())
            return;

        var categories = new List<Category>
        {
            new() { Name = "Hotels", Description = "Hotels and accommodation", Icon = "hotel" },
            new() { Name = "Hospitals", Description = "Healthcare facilities", Icon = "hospital" },
            new() { Name = "Schools", Description = "Primary and secondary schools", Icon = "school" },
            new() { Name = "Restaurants", Description = "Dining and catering", Icon = "restaurant" },
            new() { Name = "Banks", Description = "Banking and finance", Icon = "bank" },
            new() { Name = "Universities", Description = "Higher education", Icon = "university" },
            new() { Name = "Pharmacies", Description = "Medicine and pharmacy", Icon = "pharmacy" },
            new() { Name = "Telecom", Description = "Telecommunications", Icon = "telecom" },
            new() { Name = "Transport", Description = "Transport and logistics", Icon = "transport" },
            new() { Name = "Supermarkets", Description = "Retail and supermarkets", Icon = "supermarket" },
        };

        db.Categories.AddRange(categories);
        await db.SaveChangesAsync();

        var cat = categories.ToDictionary(c => c.Name, c => c.Id);
        var now = DateTime.UtcNow;

        const string logo1 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/sample.jpg";
        const string logo2 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/models.jpg";
        const string logo3 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/coffee.jpg";
        const string logo4 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/kitchen.jpg";
        const string logo5 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/dog.jpg";
        const string logo6 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/woman-on-a-football-field.jpg";
        const string logo7 = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/canvas.jpg";

        db.Businesses.AddRange(
            new Business
            {
                Name = "Hormuud Telecom",
                Description = "Leading telecommunications company in Somalia.",
                Phone = "+252 61 5000000",
                Email = "info@hormuud.com",
                Address = "Howlwadaag, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Telecom"],
                Website = "https://www.hormuud.com",
                LogoUrl = logo1,
                Rating = 4.8,
                CreatedAt = now
            },
            new Business
            {
                Name = "Premier Bank",
                Description = "Provides banking and financial services.",
                Phone = "+252 61 4000000",
                Email = "contact@premierbank.so",
                Address = "Maka Al-Mukarama Road, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Banks"],
                Website = "https://www.premierbank.so",
                LogoUrl = logo2,
                Rating = 4.6,
                CreatedAt = now
            },
            new Business
            {
                Name = "Salaam Bank",
                Description = "Islamic banking services across Somalia.",
                Phone = "+252 61 7000000",
                Email = "info@salaambank.so",
                Address = "KM4, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Banks"],
                LogoUrl = logo3,
                Rating = 4.5,
                CreatedAt = now
            },
            new Business
            {
                Name = "Somtel",
                Description = "Mobile and internet services provider.",
                Phone = "+252 61 2222222",
                Email = "support@somtel.so",
                Address = "Hodan District, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Telecom"],
                LogoUrl = logo4,
                Rating = 4.4,
                CreatedAt = now
            },
            new Business
            {
                Name = "Amal Bank",
                Description = "Trusted Somali banking institution.",
                Phone = "+252 61 3333333",
                Email = "hello@amalbank.com",
                Address = "Wadajir, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Banks"],
                LogoUrl = logo5,
                Rating = 4.5,
                CreatedAt = now
            },
            new Business
            {
                Name = "SIMAD University",
                Description = "Leading private university in Mogadishu.",
                Phone = "+252 61 4444444",
                Email = "info@simad.edu.so",
                Address = "Afgooye Road, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Universities"],
                Website = "https://www.simad.edu.so",
                LogoUrl = logo6,
                Rating = 4.7,
                CreatedAt = now
            },
            new Business
            {
                Name = "Digfeer Hospital",
                Description = "Major public hospital serving Mogadishu.",
                Phone = "+252 61 5555555",
                Email = "contact@digfeer.gov.so",
                Address = "Digfeer, Mogadishu",
                City = "Mogadishu",
                CategoryId = cat["Hospitals"],
                LogoUrl = logo7,
                Rating = 4.3,
                CreatedAt = now
            }
        );

        await db.SaveChangesAsync();
    }
}
