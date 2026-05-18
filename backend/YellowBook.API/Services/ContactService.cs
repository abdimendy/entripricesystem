using YellowBook.API.DTOs;
using YellowBook.API.Models;
using YellowBook.API.Data;
using Microsoft.EntityFrameworkCore;

namespace YellowBook.API.Services;

public interface IContactService
{
    Task<(ContactMessageDto? Result, string? Error)> CreateAsync(CreateContactDto dto);
    Task<IEnumerable<ContactMessageDto>> GetAllAsync();
    Task<bool> MarkReadAsync(int id);
}

public class ContactService : IContactService
{
    private readonly YellowBookDbContext _db;

    public ContactService(YellowBookDbContext db) => _db = db;

    public async Task<(ContactMessageDto? Result, string? Error)> CreateAsync(CreateContactDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.CompanyWebsite))
            return (null, "Invalid submission.");

        var msg = new ContactMessage
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Phone = dto.Phone?.Trim(),
            Subject = dto.Subject.Trim(),
            Message = dto.Message.Trim(),
            CreatedAt = DateTime.UtcNow
        };
        _db.ContactMessages.Add(msg);
        await _db.SaveChangesAsync();
        return (Map(msg), null);
    }

    public async Task<IEnumerable<ContactMessageDto>> GetAllAsync()
    {
        var list = await _db.ContactMessages.OrderByDescending(m => m.CreatedAt).ToListAsync();
        return list.Select(Map);
    }

    public async Task<bool> MarkReadAsync(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return false;
        msg.IsRead = true;
        await _db.SaveChangesAsync();
        return true;
    }

    private static ContactMessageDto Map(ContactMessage m) => new()
    {
        Id = m.Id,
        Name = m.Name,
        Email = m.Email,
        Phone = m.Phone,
        Subject = m.Subject,
        Message = m.Message,
        CreatedAt = m.CreatedAt,
        IsRead = m.IsRead
    };
}
