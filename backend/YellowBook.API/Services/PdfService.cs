using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using YellowBook.API.Repositories;

namespace YellowBook.API.Services;

public interface IPdfService
{
    Task<byte[]?> GenerateBusinessPdfAsync(int businessId);
    Task<byte[]> GenerateReportPdfAsync(string? name = null, int? categoryId = null, string? city = null);
}

public class PdfService : IPdfService
{
    private readonly IBusinessRepository _businessRepository;

    public PdfService(IBusinessRepository businessRepository)
    {
        _businessRepository = businessRepository;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]?> GenerateBusinessPdfAsync(int businessId)
    {
        var business = await _businessRepository.GetByIdAsync(businessId);
        if (business is null) return null;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.Header().Text("YellowBook Directory").FontSize(22).Bold().FontColor(Colors.Amber.Darken2);
                page.Content().Column(col =>
                {
                    col.Item().Text(business.Name).FontSize(18).Bold();
                    col.Item().PaddingTop(8).Text($"Category: {business.Category?.Name}");
                    col.Item().Text($"Rating: {business.Rating:F1} / 5");
                    col.Item().PaddingTop(12).Text("Contact").Bold();
                    col.Item().Text($"Phone: {business.Phone}");
                    col.Item().Text($"Email: {business.Email}");
                    col.Item().Text($"Address: {business.Address}, {business.City}");
                    if (!string.IsNullOrWhiteSpace(business.Website))
                        col.Item().Text($"Website: {business.Website}");
                    col.Item().PaddingTop(12).Text("Description").Bold();
                    col.Item().Text(business.Description ?? "No description provided.");
                });
                page.Footer().AlignCenter().Text($"Generated {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC");
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> GenerateReportPdfAsync(string? name = null, int? categoryId = null, string? city = null)
    {
        var businesses = (await _businessRepository.GetFilteredListAsync(name, categoryId, city, approvedOnly: true)).ToList();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.Header().Column(h =>
                {
                    h.Item().Text("YellowBook — Telephone Directory").FontSize(20).Bold();
                    h.Item().Text($"{businesses.Count} businesses · {DateTime.UtcNow:yyyy-MM-dd}").FontSize(10);
                });
                page.Content().PaddingTop(12).Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn(3);
                        c.RelativeColumn(2);
                        c.RelativeColumn(2);
                        c.RelativeColumn(2);
                        c.RelativeColumn(2);
                    });
                    table.Header(h =>
                    {
                        h.Cell().Background(Colors.Amber.Lighten4).Padding(4).Text("Name").Bold();
                        h.Cell().Background(Colors.Amber.Lighten4).Padding(4).Text("Phone").Bold();
                        h.Cell().Background(Colors.Amber.Lighten4).Padding(4).Text("Category").Bold();
                        h.Cell().Background(Colors.Amber.Lighten4).Padding(4).Text("City").Bold();
                        h.Cell().Background(Colors.Amber.Lighten4).Padding(4).Text("Email").Bold();
                    });
                    foreach (var b in businesses)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(b.Name);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(b.Phone);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(b.Category?.Name ?? "-");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(b.City);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(b.Email);
                    }
                });
                page.Footer().AlignCenter().Text("Yellow Book — Somalia Business Directory");
            });
        });

        return document.GeneratePdf();
    }
}
