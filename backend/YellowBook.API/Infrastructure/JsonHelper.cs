using System.Text.Json;

namespace YellowBook.API.Infrastructure;

public static class JsonHelper
{
    private static readonly JsonSerializerOptions Options = new() { PropertyNameCaseInsensitive = true };

    public static List<string> ParseStringList(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new();
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, Options) ?? new();
        }
        catch
        {
            return new();
        }
    }

    public static string? SerializeStringList(List<string>? list)
    {
        if (list is null || list.Count == 0) return null;
        return JsonSerializer.Serialize(list.Where(u => !string.IsNullOrWhiteSpace(u)).Select(u => u.Trim()).Distinct());
    }

    public static Dictionary<string, string> ParseHours(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new();
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(json, Options) ?? new();
        }
        catch
        {
            return new();
        }
    }

    public static string? SerializeHours(Dictionary<string, string>? hours)
    {
        if (hours is null || hours.Count == 0) return null;
        return JsonSerializer.Serialize(hours);
    }
}
