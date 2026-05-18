using YellowBook.API.Models;

namespace YellowBook.API.Repositories;

public interface IBusinessRepository
{
    Task<IEnumerable<Business>> GetAllAsync(bool approvedOnly = false);
    Task<IEnumerable<Business>> GetPendingAsync();
    Task<Business?> GetByIdAsync(int id, bool approvedOnly = false);
    Task<(IEnumerable<Business> Items, int Total)> SearchAsync(
        string? name, int? categoryId, string? city, int page = 1, int pageSize = 12, bool approvedOnly = true);
    Task<IEnumerable<Business>> GetFeaturedAsync(int count);
    Task<IEnumerable<Business>> GetFilteredListAsync(string? name, int? categoryId, string? city, bool approvedOnly = true);
    Task<Business> AddAsync(Business business);
    Task<Business?> UpdateAsync(Business business);
    Task<bool> DeleteAsync(int id);
    Task<int> CountAsync(bool approvedOnly = false);
    Task<int> CountPendingAsync();
    Task<IEnumerable<Business>> GetRecentAsync(int count);
    Task<bool> CategoryExistsAsync(int categoryId);
    Task RecalculateRatingAsync(int businessId);
}
