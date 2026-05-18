namespace YellowBook.API.Infrastructure;

/// <summary>
/// Resolves PostgreSQL connection from appsettings or cloud URL (Neon, Supabase, Render).
/// </summary>
public static class ConnectionStringResolver
{
    public static string? Resolve(IConfiguration configuration)
    {
        var databaseUrl =
            configuration["DATABASE_URL"]
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");

        if (!string.IsNullOrWhiteSpace(databaseUrl))
            return FromDatabaseUrl(databaseUrl);

        var fromConfig = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrWhiteSpace(fromConfig))
            return fromConfig;

        return null;
    }

    /// <summary>
    /// Converts postgresql://user:pass@host:5432/db?sslmode=require to Npgsql format.
    /// </summary>
    public static string FromDatabaseUrl(string databaseUrl)
    {
        var raw = databaseUrl.Trim();
        if (!raw.StartsWith("postgres", StringComparison.OrdinalIgnoreCase))
            return raw;

        var uri = new Uri(raw);
        var userInfo = uri.UserInfo.Split(':', 2);
        var user = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/').Split('?')[0];

        var requireSsl =
            raw.Contains("sslmode=require", StringComparison.OrdinalIgnoreCase)
            || raw.Contains("ssl=true", StringComparison.OrdinalIgnoreCase)
            || host.Contains("neon.tech", StringComparison.OrdinalIgnoreCase)
            || host.Contains("supabase.co", StringComparison.OrdinalIgnoreCase);

        var parts = new List<string>
        {
            $"Host={host}",
            $"Port={port}",
            $"Database={database}",
            $"Username={user}",
            $"Password={password}",
        };

        if (requireSsl)
        {
            parts.Add("SSL Mode=Require");
            parts.Add("Trust Server Certificate=true");
        }

        return string.Join(';', parts);
    }
}
