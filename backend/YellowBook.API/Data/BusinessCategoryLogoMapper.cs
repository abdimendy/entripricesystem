namespace YellowBook.API.Data;

/// <summary>
/// Category-appropriate image URL for each business (Unsplash + Cloudinary demo fallbacks).
/// </summary>
public static class BusinessCategoryLogoMapper
{
    private const string Cloudinary = "https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto";

    private static class Images
    {
        public const string Telecom =
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&q=80";
        public const string Hotel =
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop&q=80";
        public const string Restaurant =
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop&q=80";
        public const string Retail =
            "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=400&fit=crop&q=80";
        public const string Healthcare =
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop&q=80";
        public const string Education =
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop&q=80";
        public const string Bank =
            $"{Cloudinary}/docs/models.jpg";
        public const string Transport =
            "https://images.unsplash.com/photo-1544622899-2e73a2d7b1e4?w=800&h=400&fit=crop&q=80";
        public const string Default = $"{Cloudinary}/sample.jpg";
    }

    public static string Resolve(string? categoryName, string? businessName = null)
    {
        var name = businessName?.ToLowerInvariant() ?? string.Empty;
        var category = categoryName?.ToLowerInvariant() ?? string.Empty;

        if (name.Contains("hormuud") || name.Contains("somtel") || name.Contains("telecom"))
            return Images.Telecom;

        if (name.Contains("bank") || name.Contains("premier") || name.Contains("salaam") || name.Contains("amal"))
            return Images.Bank;

        if (name.Contains("serena") || name.Contains("hotel"))
            return Images.Hotel;

        if (name.Contains("lido") || name.Contains("seafood") || name.Contains("fork") || name.Contains("restaurant") || name.Contains("hamar"))
            return Images.Restaurant;

        if (name.Contains("beco") || name.Contains("supermarket") || name.Contains("market"))
            return Images.Retail;

        if (name.Contains("simad") || name.Contains("university") || name.Contains("school"))
            return Images.Education;

        if (name.Contains("digfeer") || name.Contains("banadir") || name.Contains("medical") || name.Contains("hospital") || name.Contains("health") || name.Contains("kalkaal") || name.Contains("sunrise"))
            return Images.Healthcare;

        if (category.Contains("restaurant") || category.Contains("dining") || category.Contains("food"))
            return Images.Restaurant;

        if (category.Contains("hotel") || category.Contains("accommodation"))
            return Images.Hotel;

        if (category.Contains("bank") || category.Contains("finance"))
            return Images.Bank;

        if (category.Contains("hospital") || category.Contains("health") || category.Contains("medical") || category.Contains("pharmacy"))
            return Images.Healthcare;

        if (category.Contains("school") || category.Contains("universit") || category.Contains("education") || category.Contains("library"))
            return Images.Education;

        if (category.Contains("telecom") || category.Contains("service"))
            return Images.Telecom;

        if (category.Contains("retail") || category.Contains("supermarket") || category.Contains("shop"))
            return Images.Retail;

        if (category.Contains("transport") || category.Contains("logistic"))
            return Images.Transport;

        if (category.Contains("sport"))
            return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop&q=80";

        return Images.Default;
    }
}
