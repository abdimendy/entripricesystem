using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace YellowBook.API.Services;

public class ImageStorageService(IConfiguration configuration, IWebHostEnvironment environment) : IImageStorageService
{
    private readonly Cloudinary? _cloudinary = CreateCloudinary(configuration);
    private readonly string _folder = configuration["Cloudinary:Folder"] ?? "yellowbook/businesses";

    public bool IsCloudinaryEnabled => _cloudinary is not null;

    public async Task<ImageUploadResult> UploadBusinessImageAsync(
        Stream stream,
        string fileName,
        string contentType)
    {
        if (_cloudinary is not null)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, stream),
                Folder = _folder,
                UseFilename = true,
                UniqueFilename = true,
                Overwrite = false,
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.Error is not null)
                throw new InvalidOperationException(result.Error.Message);

            return new ImageUploadResult(
                result.SecureUrl?.ToString() ?? result.Url?.ToString() ?? string.Empty,
                result.PublicId,
                "cloudinary");
        }

        var uploadsDir = Path.Combine(environment.ContentRootPath, "wwwroot", "uploads", "businesses");
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(fileName);
        if (string.IsNullOrWhiteSpace(ext))
            ext = contentType switch
            {
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/gif" => ".gif",
                _ => ".jpg",
            };

        var storedName = $"{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        var filePath = Path.Combine(uploadsDir, storedName);

        await using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await stream.CopyToAsync(fileStream);
        }

        return new ImageUploadResult($"/uploads/businesses/{storedName}", storedName, "local");
    }

    private static Cloudinary? CreateCloudinary(IConfiguration configuration)
    {
        var cloudinaryUrl = configuration["CLOUDINARY_URL"]
            ?? Environment.GetEnvironmentVariable("CLOUDINARY_URL");

        if (!string.IsNullOrWhiteSpace(cloudinaryUrl))
            return new Cloudinary(cloudinaryUrl);

        var cloudName = configuration["Cloudinary:CloudName"]
            ?? configuration["CLOUDINARY_CLOUD_NAME"];
        var apiKey = configuration["Cloudinary:ApiKey"]
            ?? configuration["CLOUDINARY_API_KEY"];
        var apiSecret = configuration["Cloudinary:ApiSecret"]
            ?? configuration["CLOUDINARY_API_SECRET"];

        if (string.IsNullOrWhiteSpace(cloudName)
            || string.IsNullOrWhiteSpace(apiKey)
            || string.IsNullOrWhiteSpace(apiSecret))
            return null;

        return new Cloudinary(new Account(cloudName.Trim(), apiKey.Trim(), apiSecret.Trim()));
    }
}
