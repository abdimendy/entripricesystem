using Microsoft.EntityFrameworkCore;

namespace YellowBook.API.Data;

/// <summary>
/// Assigns category-appropriate Cloudinary images to every business.
/// </summary>
public static class CloudinaryLogoSeeder
{
    public static async Task EnsureAsync(YellowBookDbContext db, ILogger logger)
    {
        var businesses = await db.Businesses
            .Include(b => b.Category)
            .OrderBy(b => b.Id)
            .ToListAsync();

        if (businesses.Count == 0) return;

        var updated = 0;
        foreach (var business in businesses)
        {
            var categoryName = business.Category?.Name;
            var expected = BusinessCategoryLogoMapper.Resolve(categoryName, business.Name);

            if (string.Equals(business.LogoUrl, expected, StringComparison.OrdinalIgnoreCase))
                continue;

            business.LogoUrl = expected;
            updated++;
        }

        if (updated > 0)
        {
            await db.SaveChangesAsync();
            logger.LogInformation("Updated {Count} business logos to match their categories.", updated);
        }
    }
}
