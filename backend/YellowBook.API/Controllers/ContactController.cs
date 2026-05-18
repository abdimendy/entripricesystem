using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YellowBook.API.DTOs;
using YellowBook.API.Services;

namespace YellowBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService) => _contactService = contactService;

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<ContactMessageDto>> Create([FromBody] CreateContactDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var (result, error) = await _contactService.CreateAsync(dto);
        if (result is null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ContactMessageDto>>> GetAll()
        => Ok(await _contactService.GetAllAsync());

    [HttpPost("{id:int}/read")]
    [Authorize]
    public async Task<IActionResult> MarkRead(int id)
    {
        var ok = await _contactService.MarkReadAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
