using System.Globalization;
using System.Text;
using YellowBook.API.DTOs;
using YellowBook.API.Infrastructure;
using YellowBook.API.Models;
using YellowBook.API.Repositories;

namespace YellowBook.API.Services;

public class BusinessService : IBusinessService
{
    private readonly IBusinessRepository _businessRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly IPaymentRepository _paymentRepository;

    public BusinessService(
        IBusinessRepository businessRepository,
        ICategoryRepository categoryRepository,
        IReviewRepository reviewRepository,
        IPaymentRepository paymentRepository)
    {
        _businessRepository = businessRepository;
        _categoryRepository = categoryRepository;
        _reviewRepository = reviewRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<IEnumerable<BusinessDto>> GetAllAsync(bool admin = false)
    {
        var businesses = await _businessRepository.GetAllAsync(approvedOnly: !admin);
        return businesses.Select(MapToDto);
    }

    public async Task<IEnumerable<BusinessDto>> GetPendingAsync()
    {
        var businesses = await _businessRepository.GetPendingAsync();
        return businesses.Select(MapToDto);
    }

    public async Task<BusinessDto?> GetByIdAsync(int id, bool admin = false)
    {
        var business = await _businessRepository.GetByIdAsync(id, approvedOnly: !admin);
        return business is null ? null : MapToDto(business);
    }

    public async Task<BusinessSearchResultDto> SearchAsync(
        string? name, int? categoryId, string? city, int page, int pageSize)
    {
        var (items, total) = await _businessRepository.SearchAsync(name, categoryId, city, page, pageSize, approvedOnly: true);
        var safePageSize = pageSize > 0 ? pageSize : 12;
        return new BusinessSearchResultDto
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = total,
            Page = page,
            PageSize = safePageSize,
            TotalPages = Math.Max(1, (int)Math.Ceiling(total / (double)safePageSize))
        };
    }

    public async Task<IEnumerable<BusinessDto>> GetFeaturedAsync(int count)
    {
        var businesses = await _businessRepository.GetFeaturedAsync(count);
        return businesses.Select(MapToDto);
    }

    public async Task<(BusinessDto? Result, string? Error)> CreateAsync(CreateBusinessDto dto, bool approved = true)
    {
        if (!await _businessRepository.CategoryExistsAsync(dto.CategoryId))
            return (null, "Selected category does not exist.");

        var business = MapFromDto(dto);
        business.IsApproved = approved;
        var created = await _businessRepository.AddAsync(business);
        return (MapToDto(created), null);
    }

    public async Task<(BusinessDto? Result, string? Error)> SubmitAsync(SubmitBusinessDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.CompanyWebsite))
            return (null, "Invalid submission.");

        return await CreateAsync(dto, approved: false);
    }

    public async Task<(BusinessDto? Result, string? Error)> UpdateAsync(int id, UpdateBusinessDto dto)
    {
        var existing = await _businessRepository.GetByIdAsync(id, approvedOnly: false);
        if (existing is null)
            return (null, "Business not found.");

        if (!await _businessRepository.CategoryExistsAsync(dto.CategoryId))
            return (null, "Selected category does not exist.");

        ApplyDto(existing, dto);
        existing.IsApproved = dto.IsApproved;
        var updated = await _businessRepository.UpdateAsync(existing);
        return updated is null ? (null, "Failed to update business.") : (MapToDto(updated), null);
    }

    public async Task<(BusinessDto? Result, string? Error)> ApproveAsync(int id)
    {
        var existing = await _businessRepository.GetByIdAsync(id, approvedOnly: false);
        if (existing is null) return (null, "Business not found.");
        existing.IsApproved = true;
        var updated = await _businessRepository.UpdateAsync(existing);
        return updated is null ? (null, "Failed to approve.") : (MapToDto(updated), null);
    }

    public async Task<(bool Success, string? Error)> DeleteAsync(int id)
    {
        var exists = await _businessRepository.GetByIdAsync(id, approvedOnly: false);
        if (exists is null) return (false, "Business not found.");
        var deleted = await _businessRepository.DeleteAsync(id);
        return deleted ? (true, null) : (false, "Failed to delete business.");
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        var recent = await _businessRepository.GetRecentAsync(5);
        var payments = (await _paymentRepository.GetAllAsync()).ToList();

        return new DashboardStatsDto
        {
            TotalBusinesses = await _businessRepository.CountAsync(approvedOnly: true),
            TotalCategories = await _categoryRepository.CountAsync(),
            TotalReviews = await _reviewRepository.CountAsync(),
            TotalPayments = payments.Count,
            TotalPaymentAmount = payments.Sum(p => p.Amount),
            PendingBusinesses = await _businessRepository.CountPendingAsync(),
            BusinessesByCategory = categories
                .Select(c => new CategoryCountDto { CategoryName = c.Name, Count = c.Businesses.Count(b => b.IsApproved) })
                .ToList(),
            RecentBusinesses = recent.Select(MapToDto).ToList()
        };
    }

    public async Task<string> ExportCsvAsync(string? name, int? categoryId, string? city, bool admin = false)
    {
        var businesses = await _businessRepository.GetFilteredListAsync(name, categoryId, city, approvedOnly: !admin);
        var sb = new StringBuilder();
        sb.AppendLine("Id,Name,Phone,Email,Address,City,Category,Rating,Featured,Approved,Website");
        foreach (var b in businesses)
        {
            sb.AppendLine(string.Join(",",
                b.Id,
                Csv(b.Name),
                Csv(b.Phone),
                Csv(b.Email),
                Csv(b.Address),
                Csv(b.City),
                Csv(b.Category?.Name ?? ""),
                b.Rating.ToString(CultureInfo.InvariantCulture),
                b.IsFeatured,
                b.IsApproved,
                Csv(b.Website ?? "")));
        }
        return sb.ToString();
    }

    private static string Csv(string value) =>
        $"\"{value.Replace("\"", "\"\"")}\"";

    public static BusinessDto MapToDto(Business business) => new()
    {
        Id = business.Id,
        Name = business.Name,
        Phone = business.Phone,
        Email = business.Email,
        Address = business.Address,
        Description = business.Description,
        CategoryId = business.CategoryId,
        CategoryName = business.Category?.Name ?? string.Empty,
        LogoUrl = business.LogoUrl,
        Website = business.Website,
        City = business.City,
        Rating = business.Rating,
        IsFeatured = business.IsFeatured,
        IsApproved = business.IsApproved,
        ImageUrls = JsonHelper.ParseStringList(business.ImageUrlsJson),
        OpeningHours = JsonHelper.ParseHours(business.OpeningHoursJson),
        Latitude = business.Latitude,
        Longitude = business.Longitude,
        CreatedAt = business.CreatedAt
    };

    private static Business MapFromDto(CreateBusinessDto dto)
    {
        var business = new Business
        {
            Name = dto.Name.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            Address = dto.Address.Trim(),
            Description = dto.Description?.Trim(),
            CategoryId = dto.CategoryId,
            LogoUrl = dto.LogoUrl?.Trim(),
            Website = dto.Website?.Trim(),
            City = string.IsNullOrWhiteSpace(dto.City) ? "Mogadishu" : dto.City.Trim(),
            Rating = dto.Rating,
            IsFeatured = dto.IsFeatured,
            ImageUrlsJson = JsonHelper.SerializeStringList(dto.ImageUrls),
            OpeningHoursJson = JsonHelper.SerializeHours(dto.OpeningHours),
            Latitude = dto.Latitude,
            Longitude = dto.Longitude
        };
        return business;
    }

    private static void ApplyDto(Business business, CreateBusinessDto dto)
    {
        business.Name = dto.Name.Trim();
        business.Phone = dto.Phone.Trim();
        business.Email = dto.Email.Trim();
        business.Address = dto.Address.Trim();
        business.Description = dto.Description?.Trim();
        business.CategoryId = dto.CategoryId;
        business.LogoUrl = dto.LogoUrl?.Trim();
        business.Website = dto.Website?.Trim();
        business.City = string.IsNullOrWhiteSpace(dto.City) ? "Mogadishu" : dto.City.Trim();
        business.Rating = dto.Rating;
        business.IsFeatured = dto.IsFeatured;
        business.ImageUrlsJson = JsonHelper.SerializeStringList(dto.ImageUrls);
        business.OpeningHoursJson = JsonHelper.SerializeHours(dto.OpeningHours);
        business.Latitude = dto.Latitude;
        business.Longitude = dto.Longitude;
    }
}
