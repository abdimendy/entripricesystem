using YellowBook.API.DTOs;

namespace YellowBook.API.Services;

public interface IBusinessService
{
    Task<IEnumerable<BusinessDto>> GetAllAsync(bool admin = false);
    Task<IEnumerable<BusinessDto>> GetPendingAsync();
    Task<BusinessDto?> GetByIdAsync(int id, bool admin = false);
    Task<BusinessSearchResultDto> SearchAsync(string? name, int? categoryId, string? city, int page, int pageSize);
    Task<IEnumerable<BusinessDto>> GetFeaturedAsync(int count);
    Task<(BusinessDto? Result, string? Error)> CreateAsync(CreateBusinessDto dto, bool approved = true);
    Task<(BusinessDto? Result, string? Error)> SubmitAsync(SubmitBusinessDto dto);
    Task<(BusinessDto? Result, string? Error)> UpdateAsync(int id, UpdateBusinessDto dto);
    Task<(BusinessDto? Result, string? Error)> ApproveAsync(int id);
    Task<(bool Success, string? Error)> DeleteAsync(int id);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<string> ExportCsvAsync(string? name, int? categoryId, string? city, bool admin = false);
}
