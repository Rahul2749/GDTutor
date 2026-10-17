using GDTutor.Application.Foundation;

namespace GDTutor.Infrastructure.Foundation;

/// <summary>Immutable local sample only. Performs no external I/O or persistence.</summary>
public sealed class InMemoryFoundationSampleSource : IFoundationSampleSource
{
    private readonly string label;

    public InMemoryFoundationSampleSource(string displayName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(displayName);
        label = $"{displayName}: local in-memory adapter (demonstration only)";
    }

    public ValueTask<string> ReadLabelAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return ValueTask.FromResult(label);
    }
}
