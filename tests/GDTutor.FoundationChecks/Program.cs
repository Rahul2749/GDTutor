using System.Text.Json;
using GDTutor.Api.Composition;
using GDTutor.Api.Configuration;
using GDTutor.Application.Foundation;
using GDTutor.Infrastructure.Foundation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

if (args.Contains("--http", StringComparer.Ordinal))
{
    return await HttpChecks.RunAsync();
}

var checks = new List<CheckResult>();

await Check("Valid Development configuration starts and resolves the scoped sample service", async () =>
{
    using var host = CreateHost();
    await host.StartAsync();
    try
    {
        using var scope = host.Services.CreateScope();
        var result = await scope.ServiceProvider.GetRequiredService<FoundationSampleService>().ReadAsync();
        Require(result.IsDemonstration && result.Label.Contains("local in-memory adapter", StringComparison.Ordinal), "Sample must remain explicitly labelled.");
        Require(result.GeneratedAtUtc.Offset == TimeSpan.Zero, "Time must be UTC.");
    }
    finally { await host.StopAsync(); }
});

await Check("Production HTTPS configuration starts without a database or external provider", async () =>
{
    using var host = CreateHost(Environments.Production, Origin("https://preview.example.test"));
    await host.StartAsync();
    await host.StopAsync();
});

await Check("Missing public origin fails during host startup", () => Reject(Environments.Production, Origin("")));
await Check("Missing display name fails during host startup", () => Reject(Environments.Development, new() { ["Application:DisplayName"] = "" }));
await Check("Overlong display name fails validation", () => Reject(Environments.Development, new() { ["Application:DisplayName"] = new string('x', 81) }));
await Check("Invalid default time zone fails during startup", () => Reject(Environments.Development, new() { ["Application:DefaultTimeZone"] = "Invalid/Example" }));
await Check("Production and Staging reject HTTP even on loopback", async () =>
{
    await Reject(Environments.Production, Origin("http://127.0.0.1:3000"));
    await Reject(Environments.Staging, Origin("http://localhost:3000"));
});
await Check("Development rejects non-loopback HTTP", () => Reject(Environments.Development, Origin("http://example.test")));
await Check("Development permits loopback host, IPv4 and IPv6 HTTP origins", async () =>
{
    foreach (var origin in new[] { "http://localhost:3000", "http://127.0.0.1:3000", "http://[::1]:3000" })
    {
        using var host = CreateHost(overrides: Origin(origin));
        await host.StartAsync();
        await host.StopAsync();
    }
});
await Check("Origins with credentials, paths, queries, fragments or malformed schemes are refused", async () =>
{
    foreach (var origin in new[] { "https://user:sample-secret@example.test", "https://example.test/path", "https://example.test/a/..", "https://example.test?key=sample-secret", "https://example.test/#fragment", "ftp://example.test", "not-an-origin", " https://example.test", "https://example.test\\path" })
    {
        await Reject(Environments.Production, Origin(origin));
    }
});
await Check("Validation errors do not echo rejected configuration values", async () =>
{
    using var host = CreateHost(Environments.Production, Origin("https://user:sample-secret@example.test"));
    try { await host.StartAsync(); throw new InvalidOperationException("Expected startup rejection."); }
    catch (OptionsValidationException error) { Require(!error.ToString().Contains("sample-secret", StringComparison.Ordinal), "Rejected value leaked."); }
});
await Check("Unknown configuration keys are rejected rather than silently ignored", async () =>
{
    using var host = CreateHost(overrides: new() { ["Application:DisplayNmae"] = "Typo" });
    try { await host.StartAsync(); throw new InvalidOperationException("Expected binding rejection."); }
    catch (OptionsValidationException) { }
});
await Check("Adapter and TimeProvider can be replaced without changing the application service", async () =>
{
    var instant = DateTimeOffset.Parse("2026-10-16T10:00:00Z", System.Globalization.CultureInfo.InvariantCulture);
    using var host = CreateHost(configure: services =>
    {
        services.Replace(ServiceDescriptor.Singleton<IFoundationSampleSource>(new FixedSource("replacement sample")));
        services.Replace(ServiceDescriptor.Singleton<TimeProvider>(new FixedTime(instant)));
    });
    using var scope = host.Services.CreateScope();
    var result = await scope.ServiceProvider.GetRequiredService<FoundationSampleService>().ReadAsync();
    Require(result.Label == "replacement sample" && result.GeneratedAtUtc == instant, "Replacement dependencies were not used.");
});
await Check("Caller registrations made before composition remain replaceable through TryAdd", async () =>
{
    using var host = CreateHost(before: services => services.AddSingleton<IFoundationSampleSource>(new FixedSource("pre-registered")));
    using var scope = host.Services.CreateScope();
    Require((await scope.ServiceProvider.GetRequiredService<FoundationSampleService>().ReadAsync()).Label == "pre-registered", "Composition overwrote a caller adapter.");
});
await Check("Scoped services are distinct per scope while the immutable adapter is shared", () =>
{
    using var host = CreateHost();
    using var first = host.Services.CreateScope();
    using var second = host.Services.CreateScope();
    var a = first.ServiceProvider.GetRequiredService<FoundationSampleService>();
    Require(ReferenceEquals(a, first.ServiceProvider.GetRequiredService<FoundationSampleService>()), "Scoped service changed within scope.");
    Require(!ReferenceEquals(a, second.ServiceProvider.GetRequiredService<FoundationSampleService>()), "Scoped service leaked across scopes.");
    Require(ReferenceEquals(first.ServiceProvider.GetRequiredService<IFoundationSampleSource>(), second.ServiceProvider.GetRequiredService<IFoundationSampleSource>()), "Immutable adapter is not shared.");
    return Task.CompletedTask;
});
await Check("Root-provider resolution of a scoped service is rejected", () =>
{
    using var host = CreateHost(Environments.Production, Origin("https://preview.example.test"));
    try { _ = host.Services.GetRequiredService<FoundationSampleService>(); throw new Exception("Expected scope rejection."); }
    catch (InvalidOperationException) { }
    return Task.CompletedTask;
});
await Check("A singleton capturing a scoped service is rejected at build time", () =>
{
    try { using var host = CreateHost(configure: services => services.AddSingleton<BadLifetimeConsumer>()); throw new Exception("Expected lifetime rejection."); }
    catch (AggregateException) { }
    return Task.CompletedTask;
});
await Check("Cancellation prevents even a replacement source from being invoked", async () =>
{
    using var cancellation = new CancellationTokenSource();
    cancellation.Cancel();
    var source = new CountingSource();
    var service = new FoundationSampleService(source, TimeProvider.System);
    try { await service.ReadAsync(cancellation.Token); throw new Exception("Expected cancellation."); }
    catch (OperationCanceledException) { Require(source.Calls == 0, "Source called after cancellation."); }
});
await Check("Cancellation arriving from an adapter cannot return a successful sample", async () =>
{
    using var cancellation = new CancellationTokenSource();
    var service = new FoundationSampleService(new CancellingSource(cancellation), TimeProvider.System);
    try { await service.ReadAsync(cancellation.Token); throw new Exception("Expected cancellation."); }
    catch (OperationCanceledException) { }
});
await Check("The in-memory adapter honors cancellation directly", async () =>
{
    using var cancellation = new CancellationTokenSource();
    cancellation.Cancel();
    try { await new InMemoryFoundationSampleSource("GD Tutor").ReadLabelAsync(cancellation.Token); throw new Exception("Expected cancellation."); }
    catch (OperationCanceledException) { }
});
await Check("Explicit later configuration values override earlier defaults", () =>
{
    var configuration = new ConfigurationBuilder().AddInMemoryCollection(Defaults())
        .AddInMemoryCollection(new Dictionary<string, string?> { ["Application:DisplayName"] = "Environment example" }).Build();
    using var host = CreateHost(configuration: configuration);
    Require(host.Services.GetRequiredService<IOptions<ApplicationOptions>>().Value.DisplayName == "Environment example", "Override was lost.");
    return Task.CompletedTask;
});

var passed = checks.All(check => check.Passed);
Console.WriteLine(JsonSerializer.Serialize(new { checkedAtUtc = DateTimeOffset.UtcNow, scope = "Real Host/DI/options validation with local sample adapters; no HTTP/database/provider calls.", checks, passed }));
return passed ? 0 : 1;

async Task Check(string name, Func<Task> action)
{
    try { await action(); checks.Add(new(name, true, null)); }
    catch (Exception error) { checks.Add(new(name, false, error.Message)); }
}

static void Require(bool condition, string message) { if (!condition) { throw new InvalidOperationException(message); } }
static Dictionary<string, string?> Defaults() => new() { ["Application:DisplayName"] = "GD Tutor", ["Application:PublicOrigin"] = "http://127.0.0.1:3000", ["Application:DefaultTimeZone"] = "Asia/Kolkata" };
static Dictionary<string, string?> Origin(string value) => new() { ["Application:PublicOrigin"] = value };
static IHost CreateHost(string environment = "Development", Dictionary<string, string?>? overrides = null, Action<IServiceCollection>? configure = null, Action<IServiceCollection>? before = null, IConfiguration? configuration = null)
{
    configuration ??= new ConfigurationBuilder().AddInMemoryCollection(Defaults()).AddInMemoryCollection(overrides ?? []).Build();
    return new HostBuilder().UseEnvironment(environment)
        .UseDefaultServiceProvider(options => { options.ValidateScopes = true; options.ValidateOnBuild = true; })
        .ConfigureServices(services => { before?.Invoke(services); services.AddBackendFoundation(configuration); configure?.Invoke(services); }).Build();
}
static async Task Reject(string environment, Dictionary<string, string?> overrides)
{
    using var host = CreateHost(environment, overrides);
    try { await host.StartAsync(); throw new Exception("Expected invalid configuration to fail before startup."); }
    catch (OptionsValidationException) { }
}

sealed record CheckResult(string Name, bool Passed, string? Error);
sealed class FixedSource(string label) : IFoundationSampleSource { public ValueTask<string> ReadLabelAsync(CancellationToken cancellationToken = default) => ValueTask.FromResult(label); }
sealed class FixedTime(DateTimeOffset instant) : TimeProvider { public override DateTimeOffset GetUtcNow() => instant; }
sealed class BadLifetimeConsumer(FoundationSampleService service) { public FoundationSampleService Service { get; } = service; }
sealed class CountingSource : IFoundationSampleSource
{
    public int Calls { get; private set; }
    public ValueTask<string> ReadLabelAsync(CancellationToken cancellationToken = default) { Calls++; return ValueTask.FromResult("counted sample"); }
}
sealed class CancellingSource(CancellationTokenSource cancellation) : IFoundationSampleSource
{
    public ValueTask<string> ReadLabelAsync(CancellationToken cancellationToken = default) { cancellation.Cancel(); return ValueTask.FromResult("late sample"); }
}
