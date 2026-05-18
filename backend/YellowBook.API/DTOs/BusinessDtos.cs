using System.ComponentModel.DataAnnotations;

namespace YellowBook.API.DTOs;

public class BusinessDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string City { get; set; } = string.Empty;
    public double Rating { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsApproved { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public Dictionary<string, string> OpeningHours { get; set; } = new();
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBusinessDto
{
    [Required(ErrorMessage = "Business name is required.")]
    [StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Address is required.")]
    [StringLength(300, MinimumLength = 5)]
    public string Address { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Category is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Please select a valid category.")]
    public int CategoryId { get; set; }

    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string City { get; set; } = "Mogadishu";
    public double Rating { get; set; } = 4.5;
    public bool IsFeatured { get; set; }
    public List<string>? ImageUrls { get; set; }
    public Dictionary<string, string>? OpeningHours { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class SubmitBusinessDto : CreateBusinessDto
{
    public string? CompanyWebsite { get; set; }
}

public class UpdateBusinessDto : CreateBusinessDto
{
    public bool IsApproved { get; set; } = true;
}

public class BusinessSearchResultDto
{
    public List<BusinessDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class DashboardStatsDto
{
    public int TotalBusinesses { get; set; }
    public int TotalCategories { get; set; }
    public int TotalReviews { get; set; }
    public int TotalPayments { get; set; }
    public decimal TotalPaymentAmount { get; set; }
    public int PendingBusinesses { get; set; }
    public List<CategoryCountDto> BusinessesByCategory { get; set; } = new();
    public List<BusinessDto> RecentBusinesses { get; set; } = new();
}

public class CategoryCountDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int Count { get; set; }
}
