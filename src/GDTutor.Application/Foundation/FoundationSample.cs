namespace GDTutor.Application.Foundation;

public sealed record FoundationSample(string Label, DateTimeOffset GeneratedAtUtc)
{
    public bool IsDemonstration => true;
}
