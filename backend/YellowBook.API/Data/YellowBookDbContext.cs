using Microsoft.EntityFrameworkCore;
using YellowBook.API.Models;

namespace YellowBook.API.Data;

public class YellowBookDbContext : DbContext
{
    public YellowBookDbContext(DbContextOptions<YellowBookDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<AnalyticsEvent> AnalyticsEvents => Set<AnalyticsEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).HasMaxLength(500);
            entity.Property(c => c.Icon).HasMaxLength(50);
            entity.HasIndex(c => c.Name).IsUnique();
        });

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<Business>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.Property(b => b.Name).IsRequired().HasMaxLength(150);
            entity.Property(b => b.Phone).IsRequired().HasMaxLength(30);
            entity.Property(b => b.Email).IsRequired().HasMaxLength(150);
            entity.Property(b => b.Address).IsRequired().HasMaxLength(300);
            entity.Property(b => b.Description).HasMaxLength(2000);
            entity.Property(b => b.LogoUrl).HasMaxLength(500);
            entity.Property(b => b.Website).HasMaxLength(300);
            entity.Property(b => b.City).IsRequired().HasMaxLength(100);
            entity.Property(b => b.Rating).HasPrecision(3, 1);
            entity.Property(b => b.CreatedAt).IsRequired();
            entity.Property(b => b.ImageUrlsJson);
            entity.Property(b => b.OpeningHoursJson);

            entity.HasOne(b => b.Category)
                .WithMany(c => c.Businesses)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.UserName).IsRequired().HasMaxLength(100);
            entity.Property(r => r.Comment).IsRequired().HasMaxLength(1000);
            entity.HasOne(r => r.Business)
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Email).IsRequired().HasMaxLength(150);
            entity.Property(c => c.Phone).HasMaxLength(30);
            entity.Property(c => c.Subject).IsRequired().HasMaxLength(150);
            entity.Property(c => c.Message).IsRequired().HasMaxLength(2000);
        });

        modelBuilder.Entity<AnalyticsEvent>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.EventType).IsRequired().HasMaxLength(50);
            entity.Property(a => a.Path).HasMaxLength(300);
            entity.Property(a => a.Meta).HasMaxLength(500);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.PayerName).IsRequired().HasMaxLength(150);
            entity.Property(p => p.Amount).HasPrecision(18, 2);
            entity.Property(p => p.PaymentMethod).IsRequired().HasMaxLength(50);
            entity.Property(p => p.TransactionNumber).IsRequired().HasMaxLength(100);
            entity.HasOne(p => p.Business)
                .WithMany(b => b.Payments)
                .HasForeignKey(p => p.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
