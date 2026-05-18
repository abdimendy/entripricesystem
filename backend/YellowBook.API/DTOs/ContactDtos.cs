using System.ComponentModel.DataAnnotations;

namespace YellowBook.API.DTOs;

public class CreateContactDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(30)]
    public string? Phone { get; set; }

    [Required, StringLength(150)]
    public string Subject { get; set; } = string.Empty;

    [Required, StringLength(2000)]
    public string Message { get; set; } = string.Empty;

  /** Honeypot — must stay empty */
    public string? CompanyWebsite { get; set; }
}

public class ContactMessageDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

public class TrackAnalyticsDto
{
    [Required, StringLength(50)]
    public string EventType { get; set; } = string.Empty;

    [StringLength(300)]
    public string? Path { get; set; }

    public int? BusinessId { get; set; }

    public string? CompanyWebsite { get; set; }
}

public class AnalyticsSummaryDto
{
    public int TotalPageViews { get; set; }
    public int TotalBusinessViews { get; set; }
    public int TotalSearches { get; set; }
    public int UnreadMessages { get; set; }
    public int PendingBusinesses { get; set; }
    public List<PopularBusinessDto> PopularBusinesses { get; set; } = new();
}

public class PopularBusinessDto
{
    public int BusinessId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Views { get; set; }
}
