using Microsoft.EntityFrameworkCore;
using YellowBook.API.Data;
using YellowBook.API.Models;

namespace YellowBook.API.Repositories;

public class BusinessRepository : IBusinessRepository
{
    private readonly YellowBookDbContext _context;

    public BusinessRepository(YellowBookDbContext context) => _context = context;

    private IQueryable<Business> BaseQuery(bool approvedOnly) =>
        _context.Businesses.Include(b => b.Category).Where(b => !approvedOnly || b.IsApproved);

    private static IQueryable<Business> ApplyFilters(IQueryable<Business> query, string? name, int? categoryId, string? city)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            var term = name.Trim().ToLower();
            query = query.Where(b =>
                b.Name.ToLower().Contains(term) ||
                b.Phone.ToLower().Contains(term) ||
                b.Email.ToLower().Contains(term) ||
                b.Address.ToLower().Contains(term) ||
                b.City.ToLower().Contains(term) ||
                (b.Description != null && b.Description.ToLower().Contains(term)) ||
                (b.Category != null && b.Category.Name.ToLower().Contains(term)));
        }

        if (categoryId is > 0)
            query = query.Where(b => b.CategoryId == categoryId);

        if (!string.IsNullOrWhiteSpace(city))
        {
            var c = city.Trim().ToLower();
            query = query.Where(b => b.City.ToLower().Contains(c));
        }

        return query;
    }

    public async Task<IEnumerable<Business>> GetAllAsync(bool approvedOnly = false)
    {
        return await BaseQuery(approvedOnly)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Business>> GetPendingAsync()
    {
        return await _context.Businesses
            .Include(b => b.Category)
            .Where(b => !b.IsApproved)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<Business?> GetByIdAsync(int id, bool approvedOnly = false)
    {
        var query = _context.Businesses
            .Include(b => b.Category)
            .Include(b => b.Reviews)
            .Where(b => b.Id == id);

        if (approvedOnly)
            query = query.Where(b => b.IsApproved);

        return await query.FirstOrDefaultAsync();
    }

    public async Task<(IEnumerable<Business> Items, int Total)> SearchAsync(
        string? name, int? categoryId, string? city, int page = 1, int pageSize = 12, bool approvedOnly = true)
    {
        var query = ApplyFilters(BaseQuery(approvedOnly), name, categoryId, city);
        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(b => b.IsFeatured)
            .ThenByDescending(b => b.Rating)
            .ThenBy(b => b.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<IEnumerable<Business>> GetFilteredListAsync(
        string? name, int? categoryId, string? city, bool approvedOnly = true)
    {
        return await ApplyFilters(BaseQuery(approvedOnly), name, categoryId, city)
            .OrderByDescending(b => b.IsFeatured)
            .ThenByDescending(b => b.Rating)
            .ThenBy(b => b.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Business>> GetFeaturedAsync(int count)
    {
        return await BaseQuery(approvedOnly: true)
            .OrderByDescending(b => b.IsFeatured)
            .ThenByDescending(b => b.Rating)
            .ThenByDescending(b => b.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Business> AddAsync(Business business)
    {
        business.CreatedAt = DateTime.UtcNow;
        _context.Businesses.Add(business);
        await _context.SaveChangesAsync();
        await _context.Entry(business).Reference(b => b.Category).LoadAsync();
        return business;
    }

    public async Task<Business?> UpdateAsync(Business business)
    {
        var existing = await _context.Businesses.FindAsync(business.Id);
        if (existing is null) return null;

        existing.Name = business.Name;
        existing.Phone = business.Phone;
        existing.Email = business.Email;
        existing.Address = business.Address;
        existing.Description = business.Description;
        existing.CategoryId = business.CategoryId;
        existing.LogoUrl = business.LogoUrl;
        existing.Website = business.Website;
        existing.City = business.City;
        existing.Rating = business.Rating;
        existing.IsFeatured = business.IsFeatured;
        existing.IsApproved = business.IsApproved;
        existing.ImageUrlsJson = business.ImageUrlsJson;
        existing.OpeningHoursJson = business.OpeningHoursJson;
        existing.Latitude = business.Latitude;
        existing.Longitude = business.Longitude;

        await _context.SaveChangesAsync();
        await _context.Entry(existing).Reference(b => b.Category).LoadAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var business = await _context.Businesses.FindAsync(id);
        if (business is null) return false;
        _context.Businesses.Remove(business);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> CountAsync(bool approvedOnly = false) =>
        await BaseQuery(approvedOnly).CountAsync();

    public async Task<int> CountPendingAsync() =>
        await _context.Businesses.CountAsync(b => !b.IsApproved);

    public async Task<IEnumerable<Business>> GetRecentAsync(int count)
    {
        return await BaseQuery(approvedOnly: false)
            .OrderByDescending(b => b.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<bool> CategoryExistsAsync(int categoryId) =>
        await _context.Categories.AnyAsync(c => c.Id == categoryId);

    public async Task RecalculateRatingAsync(int businessId)
    {
        var business = await _context.Businesses
            .Include(b => b.Reviews)
            .FirstOrDefaultAsync(b => b.Id == businessId);
        if (business is null || business.Reviews.Count == 0) return;

        business.Rating = Math.Round(business.Reviews.Average(r => r.Rating), 1);
        await _context.SaveChangesAsync();
    }
}
