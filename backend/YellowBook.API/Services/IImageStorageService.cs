namespace YellowBook.API.Services;

public interface IImageStorageService
{
    bool IsCloudinaryEnabled { get; }

    Task<ImageUploadResult> UploadBusinessImageAsync(Stream stream, string fileName, string contentType);
}

public record ImageUploadResult(string Url, string? PublicId, string Provider);
