using YellowBook.API.DTOs;
using YellowBook.API.Models;
using YellowBook.API.Repositories;

namespace YellowBook.API.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IBusinessRepository _businessRepository;

    public ReviewService(IReviewRepository reviewRepository, IBusinessRepository businessRepository)
    {
        _reviewRepository = reviewRepository;
        _businessRepository = businessRepository;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllAsync()
        => (await _reviewRepository.GetAllAsync()).Select(MapToDto);

    public async Task<IEnumerable<ReviewDto>> GetByBusinessIdAsync(int businessId)
        => (await _reviewRepository.GetByBusinessIdAsync(businessId)).Select(MapToDto);

    public async Task<ReviewDto?> GetByIdAsync(int id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        return review is null ? null : MapToDto(review);
    }

    public async Task<(ReviewDto? Result, string? Error)> CreateAsync(CreateReviewDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.CompanyWebsite))
            return (null, "Invalid submission.");

        if (await _businessRepository.GetByIdAsync(dto.BusinessId, approvedOnly: true) is null)
            return (null, "Business not found.");

        var review = new Review
        {
            BusinessId = dto.BusinessId,
            UserName = dto.UserName.Trim(),
            Comment = dto.Comment.Trim(),
            Rating = dto.Rating
        };

        var created = await _reviewRepository.AddAsync(review);
        await _businessRepository.RecalculateRatingAsync(dto.BusinessId);
        return (MapToDto(created), null);
    }

    public async Task<(ReviewDto? Result, string? Error)> UpdateAsync(int id, UpdateReviewDto dto)
    {
        var existing = await _reviewRepository.GetByIdAsync(id);
        if (existing is null) return (null, "Review not found.");

        existing.UserName = dto.UserName.Trim();
        existing.Comment = dto.Comment.Trim();
        existing.Rating = dto.Rating;

        var updated = await _reviewRepository.UpdateAsync(existing);
        return updated is null ? (null, "Failed to update review.") : (MapToDto(updated), null);
    }

    public async Task<(bool Success, string? Error)> DeleteAsync(int id)
    {
        var deleted = await _reviewRepository.DeleteAsync(id);
        return deleted ? (true, null) : (false, "Review not found.");
    }

    private static ReviewDto MapToDto(Review review) => new()
    {
        Id = review.Id,
        BusinessId = review.BusinessId,
        UserName = review.UserName,
        Comment = review.Comment,
        Rating = review.Rating,
        CreatedAt = review.CreatedAt
    };
}
