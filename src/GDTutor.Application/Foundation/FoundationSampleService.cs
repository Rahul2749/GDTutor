namespace GDTutor.Application.Foundation;

public sealed class FoundationSampleService(IFoundationSampleSource source, TimeProvider timeProvider)
{
    public async ValueTask<FoundationSample> ReadAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var label = await source.ReadLabelAsync(cancellationToken);
        cancellationToken.ThrowIfCancellationRequested();
        return new FoundationSample(label, timeProvider.GetUtcNow());
    }
}
