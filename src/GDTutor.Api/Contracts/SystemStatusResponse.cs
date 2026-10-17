using GDTutor.Application.Foundation;

namespace GDTutor.Api.Contracts;

public sealed record SystemStatusResponse(string Status, string ApiVersion, DateTime ServerTime, string SampleLabel,
    bool IsDemonstration, string Scope, bool DependenciesVerified)
{
    public static SystemStatusResponse FromSample(FoundationSample sample) =>
        new("available", "v1", sample.GeneratedAtUtc.UtcDateTime, sample.Label, sample.IsDemonstration, "foundation", false);
}
