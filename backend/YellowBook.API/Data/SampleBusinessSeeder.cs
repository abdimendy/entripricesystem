using Microsoft.EntityFrameworkCore;
using YellowBook.API.Models;

namespace YellowBook.API.Data;

/// <summary>
/// Ensures five varied sample businesses with Cloudinary images exist.
/// </summary>
public static class SampleBusinessSeeder
{
    private record SampleBusiness(
        string Name,
        string CategoryName,
        string Description,
        string Phone,
        string Email,
        string Address,
        string City,
        string LogoUrl,
        string? Website,
        double Rating);

    private static readonly SampleBusiness[] Samples =
    [
        new(
            "Hormuud Telecom",
            "Services",
            "Leading mobile, internet and digital services across Somalia.",
            "+252 61 5000000",
            "info@hormuud.com",
            "Howlwadaag, Mogadishu",
            "Mogadishu",
            "",
            "https://www.hormuud.com",
            4.9),
        new(
            "Mogadishu Serena Hotel",
            "Hotels",
            "Luxury hotel with conference halls, dining and waterfront views.",
            "+252 61 2000000",
            "reservations@serena.co",
            "Airport Road, Wadajir",
            "Mogadishu",
            "",
            null,
            4.8),
        new(
            "Lido Seafood Restaurant",
            "Restaurants",
            "Fresh seafood and traditional Somali cuisine by the beach.",
            "+252 61 7700000",
            "hello@lidoseafood.so",
            "Lido Beach, Mogadishu",
            "Mogadishu",
            "",
            null,
            4.7),
        new(
            "Beco Supermarket",
            "Retail",
            "Large supermarket for groceries, household goods and fresh produce.",
            "+252 61 8800000",
            "info@beco.so",
            "KM4, Hodan District",
            "Mogadishu",
            "",
            null,
            4.6),
        new(
            "SIMAD University",
            "school",
            "Private university offering business, IT and health sciences programs.",
            "+252 61 4444444",
            "info@simad.edu.so",
            "Afgooye Road, Mogadishu",
            "Mogadishu",
            "",
            "https://www.simad.edu.so",
            4.7),
    ];

    public static async Task EnsureAsync(YellowBookDbContext db, ILogger logger)
    {
        var added = 0;
        var now = DateTime.UtcNow;

        foreach (var sample in Samples)
        {
            if (await db.Businesses.AnyAsync(b => b.Name == sample.Name))
                continue;

            var categoryId = await ResolveCategoryIdAsync(db, sample.CategoryName);
            if (categoryId is null)
            {
                logger.LogWarning("Skipping {Name}: category '{Category}' not found.", sample.Name, sample.CategoryName);
                continue;
            }

            db.Businesses.Add(new Business
            {
                Name = sample.Name,
                Description = sample.Description,
                Phone = sample.Phone,
                Email = sample.Email,
                Address = sample.Address,
                City = sample.City,
                CategoryId = categoryId.Value,
                LogoUrl = string.IsNullOrWhiteSpace(sample.LogoUrl)
                    ? BusinessCategoryLogoMapper.Resolve(sample.CategoryName, sample.Name)
                    : sample.LogoUrl,
                Website = sample.Website,
                Rating = sample.Rating,
                CreatedAt = now,
            });
            added++;
        }

        if (added > 0)
        {
            await db.SaveChangesAsync();
            logger.LogInformation("Added {Count} sample businesses.", added);
        }
    }

    private static async Task<int?> ResolveCategoryIdAsync(YellowBookDbContext db, string categoryName)
    {
        var categories = await db.Categories.ToListAsync();
        var match = categories.FirstOrDefault(c =>
            c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));
        if (match is not null) return match.Id;

        match = categories.FirstOrDefault(c =>
            c.Name.Contains(categoryName, StringComparison.OrdinalIgnoreCase)
            || categoryName.Contains(c.Name, StringComparison.OrdinalIgnoreCase));

        return match?.Id ?? categories.FirstOrDefault()?.Id;
    }
}
