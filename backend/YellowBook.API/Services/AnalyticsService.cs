using Microsoft.EntityFrameworkCore;
using YellowBook.API.Data;
using YellowBook.API.DTOs;
using YellowBook.API.Models;

namespace YellowBook.API.Services;

public interface IAnalyticsService
{
    Task TrackAsync(TrackAnalyticsDto dto);
    Task<AnalyticsSummaryDto> GetSummaryAsync();
}

public class AnalyticsService : IAnalyticsService
{
    private readonly YellowBookDbContext _db;

    public AnalyticsService(YellowBookDbContext db) => _db = db;

    public async Task TrackAsync(TrackAnalyticsDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.CompanyWebsite)) return;

        _db.AnalyticsEvents.Add(new AnalyticsEvent
        {
            EventType = dto.EventType.Trim(),
            Path = dto.Path?.Trim(),
            BusinessId = dto.BusinessId,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }

    public async Task<AnalyticsSummaryDto> GetSummaryAsync()
    {
        var events = await _db.AnalyticsEvents.ToListAsync();
        var popular = events
            .Where(e => e.EventType == "business_view" && e.BusinessId.HasValue)
            .GroupBy(e => e.BusinessId!.Value)
            .Select(g => new { BusinessId = g.Key, Views = g.Count() })
            .OrderByDescending(x => x.Views)
            .Take(5)
            .ToList();

        var businessNames = await _db.Businesses
            .Where(b => popular.Select(p => p.BusinessId).Contains(b.Id))
            .ToDictionaryAsync(b => b.Id, b => b.Name);

        return new AnalyticsSummaryDto
        {
            TotalPageViews = events.Count(e => e.EventType == "page_view"),
            TotalBusinessViews = events.Count(e => e.EventType == "business_view"),
            TotalSearches = events.Count(e => e.EventType == "search"),
            UnreadMessages = await _db.ContactMessages.CountAsync(m => !m.IsRead),
            PendingBusinesses = await _db.Businesses.CountAsync(b => !b.IsApproved),
            PopularBusinesses = popular.Select(p => new PopularBusinessDto
            {
                BusinessId = p.BusinessId,
                Name = businessNames.GetValueOrDefault(p.BusinessId, $"#{p.BusinessId}"),
                Views = p.Views
            }).ToList()
        };
    }
}
