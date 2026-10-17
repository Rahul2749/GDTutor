using System.ComponentModel.DataAnnotations;

namespace GDTutor.Api.Configuration;

public sealed class ApplicationOptions
{
    public const string SectionName = "Application";

    [Required(ErrorMessage = "Application display name is required.")]
    [StringLength(80, ErrorMessage = "Application display name must not exceed 80 characters.")]
    public string DisplayName { get; set; } = "";

    [Required(ErrorMessage = "Application public origin is required.")]
    [StringLength(2048, ErrorMessage = "Application public origin is too long.")]
    public string PublicOrigin { get; set; } = "";

    [Required(ErrorMessage = "Application default time zone is required.")]
    [StringLength(100, ErrorMessage = "Application default time zone is too long.")]
    public string DefaultTimeZone { get; set; } = "";
}
