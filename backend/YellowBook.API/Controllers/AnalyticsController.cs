using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YellowBook.API.DTOs;
using YellowBook.API.Services;

namespace YellowBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService) => _analyticsService = analyticsService;

    [HttpPost("track")]
    [AllowAnonymous]
    public async Task<IActionResult> Track([FromBody] TrackAnalyticsDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        await _analyticsService.TrackAsync(dto);
        return NoContent();
    }

    [HttpGet("summary")]
    [Authorize]
    public async Task<ActionResult<AnalyticsSummaryDto>> Summary()
        => Ok(await _analyticsService.GetSummaryAsync());
}
