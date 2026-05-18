using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YellowBook.API.Services;

namespace YellowBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController(IImageStorageService imageStorage, IConfiguration configuration) : ControllerBase
{
    private static readonly string[] AllowedTypes =
        ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

    [HttpPost("business-image")]
    [Authorize]
    public async Task<ActionResult<object>> UploadBusinessImage(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Image must be under 5 MB." });

        if (!AllowedTypes.Contains(file.ContentType.ToLowerInvariant()))
            return BadRequest(new { message = "Only JPG, PNG, WEBP, or GIF images are allowed." });

        await using var stream = file.OpenReadStream();
        var result = await imageStorage.UploadBusinessImageAsync(stream, file.FileName, file.ContentType);

        var url = result.Url;
        if (result.Provider == "local" && url.StartsWith('/'))
        {
            var baseUrl = configuration["PublicApiUrl"]?.TrimEnd('/');
            if (string.IsNullOrWhiteSpace(baseUrl))
                baseUrl = $"{Request.Scheme}://{Request.Host}";
            url = $"{baseUrl}{url}";
        }

        return Ok(new
        {
            url,
            fileName = result.PublicId ?? Path.GetFileName(url),
            provider = result.Provider,
            cloudinary = result.Provider == "cloudinary",
        });
    }

    [HttpGet("status")]
    [AllowAnonymous]
    public ActionResult<object> Status() =>
        Ok(new
        {
            cloudinary = imageStorage.IsCloudinaryEnabled,
            message = imageStorage.IsCloudinaryEnabled
                ? "Images are stored on Cloudinary."
                : "Cloudinary not configured — using local uploads folder.",
        });
}
