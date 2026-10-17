namespace GDTutor.Application.Foundation;

/// <summary>A demonstration port, not a database or provider readiness probe.</summary>
public interface IFoundationSampleSource
{
    ValueTask<string> ReadLabelAsync(CancellationToken cancellationToken = default);
}
