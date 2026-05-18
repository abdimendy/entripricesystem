namespace YellowBook.API.Infrastructure;

/// <summary>
/// Loads repo-root .env into process environment (only keys not already set).
/// </summary>
public static class EnvFileLoader
{
    public static void LoadFromRepoRoot(string contentRootPath)
    {
        var dir = contentRootPath;
        for (var i = 0; i < 6; i++)
        {
            var candidate = Path.Combine(dir, ".env");
            if (File.Exists(candidate))
            {
                LoadFile(candidate);
                return;
            }

            var parent = Directory.GetParent(dir);
            if (parent is null) break;
            dir = parent.FullName;
        }
    }

    public static void LoadFile(string path)
    {
        foreach (var rawLine in File.ReadAllLines(path))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith('#')) continue;

            var eq = line.IndexOf('=');
            if (eq <= 0) continue;

            var key = line[..eq].Trim();
            var value = line[(eq + 1)..].Trim().Trim('"');
            if (string.IsNullOrEmpty(key)) continue;

            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(key)))
                Environment.SetEnvironmentVariable(key, value);
        }
    }
}
