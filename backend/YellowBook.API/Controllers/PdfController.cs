using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YellowBook.API.Services;

namespace YellowBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class PdfController : ControllerBase
{
    private readonly IPdfService _pdfService;

    public PdfController(IPdfService pdfService) => _pdfService = pdfService;

    [HttpGet("business/{id:int}")]
    public async Task<IActionResult> DownloadBusiness(int id)
    {
        var pdf = await _pdfService.GenerateBusinessPdfAsync(id);
        if (pdf is null) return NotFound(new { message = "Business not found." });
        return File(pdf, "application/pdf", $"yellowbook-business-{id}.pdf");
    }

    [HttpGet("report")]
    public async Task<IActionResult> DownloadReport(
        [FromQuery] string? name,
        [FromQuery] int? categoryId,
        [FromQuery] string? city)
    {
        var pdf = await _pdfService.GenerateReportPdfAsync(name, categoryId, city);
        return File(pdf, "application/pdf", "yellowbook-directory.pdf");
    }
}
