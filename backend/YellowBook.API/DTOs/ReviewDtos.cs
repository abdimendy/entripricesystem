using System.ComponentModel.DataAnnotations;

namespace YellowBook.API.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public int BusinessId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    [Required]
    public int BusinessId { get; set; }

    [Required, StringLength(100)]
    public string UserName { get; set; } = string.Empty;

    [Required, StringLength(1000)]
    public string Comment { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }

    public string? CompanyWebsite { get; set; }
}

public class UpdateReviewDto
{
    [Required, StringLength(100)]
    public string UserName { get; set; } = string.Empty;

    [Required, StringLength(1000)]
    public string Comment { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }
}
