using Microsoft.Extensions.Options;

namespace GDTutor.Api.Configuration;

public sealed class ApplicationOptionsValidator(IHostEnvironment environment) : IValidateOptions<ApplicationOptions>
{
    public ValidateOptionsResult Validate(string? name, ApplicationOptions options)
    {
        var errors = new List<string>();
        if (!IsAllowedOrigin(options.PublicOrigin))
        {
            errors.Add("Application public origin must be an HTTPS origin without credentials, path, query or fragment. HTTP is allowed only for loopback in Development.");
        }

        try
        {
            if (string.IsNullOrWhiteSpace(options.DefaultTimeZone))
            {
                errors.Add("Application default time zone must be a recognized identifier.");
            }
            else
            {
                _ = TimeZoneInfo.FindSystemTimeZoneById(options.DefaultTimeZone);
            }
        }
        catch (TimeZoneNotFoundException)
        {
            errors.Add("Application default time zone must be a recognized identifier.");
        }
        catch (InvalidTimeZoneException)
        {
            errors.Add("Application default time zone data is unavailable.");
        }

        return errors.Count == 0 ? ValidateOptionsResult.Success : ValidateOptionsResult.Fail(errors);
    }

    private bool IsAllowedOrigin(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Any(character => char.IsWhiteSpace(character) || char.IsControl(character)) || value.Contains('\\') ||
            !Uri.TryCreate(value, UriKind.Absolute, out var origin) ||
            origin.UserInfo.Length != 0 || origin.AbsolutePath != "/" ||
            origin.Query.Length != 0 || origin.Fragment.Length != 0)
        {
            return false;
        }

        var authorityStart = value.IndexOf("://", StringComparison.Ordinal) + 3;
        var pathStart = value.IndexOf('/', authorityStart);
        if (pathStart >= 0 && pathStart != value.Length - 1)
        {
            return false;
        }

        return origin.Scheme == Uri.UriSchemeHttps ||
            (origin.Scheme == Uri.UriSchemeHttp && origin.IsLoopback && environment.IsDevelopment());
    }
}
