namespace YellowBook.API.Models;

public class AnalyticsEvent
{
    public int Id { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string? Path { get; set; }
    public int? BusinessId { get; set; }
    public string? Meta { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
