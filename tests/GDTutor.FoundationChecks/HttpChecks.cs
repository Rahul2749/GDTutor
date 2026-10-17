using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using GDTutor.Api.Composition;
using GDTutor.Api.Controllers;
using GDTutor.Application.Foundation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

internal static class HttpChecks
{
    public static async Task<int> RunAsync()
    {
        var checks = new List<object>();
        var failed = false;
        var chunkedOverflow = "not checked";
        async Task Check(string name, Func<Task> run)
        {
            try { await run(); checks.Add(new { name, passed = true, error = (string?)null }); }
            catch (Exception error) { failed = true; checks.Add(new { name, passed = false, error = error.Message }); }
        }
        var logs = new CapturedLogs();
        await using (var development = await StartAsync(Environments.Development, logs))
        {
            using var client = Client(development);
            await Check("Status controller uses sample service, camelCase JSON, UTC and explicit demonstration scope", async () =>
            {
                var result = await Send(client, HttpMethod.Get, "/api/v1/system/status");
                Require(result.Status == 200 && result.Json.GetProperty("isDemonstration").GetBoolean(), "Status sample missing.");
                Require(result.Json.GetProperty("scope").GetString() == "foundation" && !result.Json.GetProperty("dependenciesVerified").GetBoolean(), "Readiness is overstated.");
                Require(result.Json.GetProperty("serverTime").GetString()!.EndsWith('Z'), "Time must use explicit UTC Z.");
                Require(result.Json.GetProperty("sampleLabel").GetString()!.Contains("local in-memory adapter", StringComparison.Ordinal), "Application service not used.");
            });
            await Check("Liveness and readiness expose only bounded foundation scope", async () =>
            {
                foreach (var path in new[] { "/health/live", "/health/ready" })
                {
                    var result = await Send(client, HttpMethod.Get, path);
                    Require(result.Status == 200 && result.Json.GetProperty("status").GetString() == "healthy", "Health unavailable.");
                    Require(!result.Json.GetProperty("dependenciesVerified").GetBoolean(), "Dependency claim unexpected.");
                    Require(result.Json.EnumerateObject().Count() == 3, "Health leaked internal details.");
                }
            });
            await Check("Unknown route returns safe 404 even when Accept requests HTML", async () =>
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, "/unknown-path-fixture?token=query-fixture");
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("text/html"));
                Problem(await Send(client, request), 404, "not_found");
            });
            await Check("Unsupported method returns 405 ProblemDetails and retains Allow header", async () =>
            {
                var result = await Send(client, HttpMethod.Post, "/api/v1/system/status");
                Problem(result, 405, "method_not_allowed");
                Require(result.Allow.Contains("GET", StringComparer.Ordinal), "Allow header lost.");
            });
            await Check("Development validation demo succeeds without echoing or saving submitted text", async () =>
            {
                var result = await Post(client, "{\"label\":\"body-fixture\"}");
                Require(result.Status == 200 && result.Json.GetProperty("accepted").GetBoolean(), "Valid demo failed.");
                Require(!result.Text.Contains("body-fixture", StringComparison.Ordinal), "Body was echoed.");
            });
            await Check("Required/length validation uses known field keys and static messages", async () =>
            {
                foreach (var body in new[] { "{}", "{\"label\":\"\"}", JsonSerializer.Serialize(new { label = new string('x', 81) }) })
                {
                    var result = await Post(client, body); Problem(result, 400, "validation_failed");
                    Require(result.Json.GetProperty("errors").TryGetProperty("label", out _), "Known field not mapped.");
                }
            });
            await Check("Malformed, wrong-type, empty and unknown-member JSON reject without raw input/type leakage", async () =>
            {
                foreach (var body in new[] { "{\"label\":", "{\"label\":{\"nested-fixture\":1}}", "", "{\"label\":\"ok\",\"unknown-member-fixture\":1}" })
                {
                    var result = await Post(client, body); Problem(result, 400, "validation_failed");
                    Require(!result.Text.Contains("fixture", StringComparison.Ordinal) && !result.Text.Contains("System.", StringComparison.Ordinal), "Binder details leaked.");
                }
            });
            await Check("JSON nesting is bounded", async () =>
            {
                var result = await Post(client, "{\"label\":" + new string('[', 40) + "1" + new string(']', 40) + "}");
                Problem(result, 400, "validation_failed");
            });
            await Check("Unsupported media type returns 415 ProblemDetails", async () =>
                Problem(await Post(client, "body-fixture", "text/plain"), 415, "unsupported_media_type"));
            await Check("Declared oversized body returns 413 without reflecting content", async () =>
                Problem(await Post(client, JsonSerializer.Serialize(new { label = new string('x', 70_000) })), 413, "payload_too_large"));
            await Check("Chunked oversized body is rejected, with server status 413 even if transport closes", async () =>
            {
                using var uploadClient = Client(development);
                using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/diagnostics/validation")
                { Content = new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { label = new string('x', 70_000) })))) };
                request.Headers.TransferEncodingChunked = true;
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var before = logs.Entries.Count;
                try
                {
                    Problem(await Send(uploadClient, request), 413, "payload_too_large");
                    chunkedOverflow = "HTTP 413 response";
                }
                catch (HttpRequestException)
                {
                    // Kestrel can close an over-limit chunked stream before HttpClient
                    // finishes sending. Do not claim a JSON response in that case.
                    await Task.Delay(100);
                    Require(logs.Entries.Skip(before).Any(entry => entry.EventId == 1000 && entry.State.TryGetValue("StatusCode", out var value) && Equals(value, 413)), "Transport closed without a server-recorded 413.");
                    chunkedOverflow = "Connection rejected during upload; server recorded 413 (JSON response unavailable to this client)";
                }
            });
            await Check("Controlled exception returns safe 500, including in Development", async () =>
            {
                var result = await Send(client, HttpMethod.Get, "/api/v1/diagnostics/failure"); Problem(result, 500, "unexpected_error");
                Require(!result.Text.Contains("fixture", StringComparison.Ordinal) && !result.Text.Contains("Exception", StringComparison.Ordinal), "Exception details leaked.");
            });
            await Check("Incoming trace/header/cookie fixtures are not used as response identifiers", async () =>
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/system/status?key=query-fixture");
                request.Headers.Add("X-Trace-Id", "incoming-trace-fixture");
                request.Headers.Add("Authorization", "Bearer authorization-fixture");
                request.Headers.Add("Cookie", "session=cookie-fixture");
                var result = await Send(client, request);
                Require(result.Status == 200 && !result.TraceId.Contains("fixture", StringComparison.Ordinal), "Untrusted trace was reflected.");
            });
            await Check("Generated OpenAPI describes real endpoints, validation/health/status shapes and error extensions", async () =>
            {
                var result = await Send(client, HttpMethod.Get, "/openapi/v1.json");
                Require(result.Status == 200 && result.Json.GetProperty("openapi").GetString()!.StartsWith("3.0", StringComparison.Ordinal), "OpenAPI missing.");
                var paths = result.Json.GetProperty("paths");
                foreach (var path in new[] { "/api/v1/system/status", "/health/live", "/health/ready", "/api/v1/diagnostics/validation", "/api/v1/diagnostics/failure", "/api/v1/diagnostics/delay" }) { Require(paths.TryGetProperty(path, out _), "Undocumented route."); }
                var schema = result.Json.GetProperty("components").GetProperty("schemas").GetProperty("ProblemDetails").GetProperty("properties");
                Require(schema.TryGetProperty("code", out _) && schema.TryGetProperty("traceId", out _) && schema.TryGetProperty("errors", out _), "Error extensions undocumented.");
                Require(!result.Json.TryGetProperty("servers", out var servers) || servers.GetArrayLength() == 0, "Host reflected in contract.");
                var response = paths.GetProperty("/api/v1/system/status").GetProperty("get").GetProperty("responses").GetProperty("200");
                Require(response.GetProperty("headers").TryGetProperty("X-Trace-Id", out _), "Trace header undocumented.");
                var artifact = Path.Combine(".planning-review", "backend", "openapi-v1.json");
                Directory.CreateDirectory(Path.GetDirectoryName(artifact)!); await File.WriteAllTextAsync(artifact, result.Text);
            });
        }
        foreach (var environment in new[] { Environments.Production, Environments.Staging })
        {
            await using var app = await StartAsync(environment, logs);
            using var client = Client(app);
            await Check($"{environment} serves sample/health but removes OpenAPI and diagnostics routes", async () =>
            {
                Require((await Send(client, HttpMethod.Get, "/api/v1/system/status")).Status == 200, "Status absent.");
                foreach (var path in new[] { "/openapi/v1.json", "/api/v1/diagnostics/failure", "/api/v1/diagnostics/validation", "/api/v1/diagnostics/delay" })
                { Problem(await Send(client, path.EndsWith("validation", StringComparison.Ordinal) ? HttpMethod.Post : HttpMethod.Get, path), 404, "not_found"); }
            });
        }
        await using (var unhealthy = await StartAsync(Environments.Production, logs, true))
        {
            using var client = Client(unhealthy);
            await Check("Failed dependency readiness returns bounded 503 while process liveness stays 200", async () =>
            {
                var result = await Send(client, HttpMethod.Get, "/health/ready");
                Require(result.Status == 503 && result.Json.GetProperty("status").GetString() == "unhealthy", "Unhealthy probe not enforced.");
                Require(!result.Text.Contains("fixture", StringComparison.Ordinal), "Health details leaked.");
                Require((await Send(client, HttpMethod.Get, "/health/live")).Status == 200, "Dependency failure affected liveness.");
            });
        }
        await using (var failedSample = await StartAsync(Environments.Production, logs, failSample: true))
        {
            using var client = Client(failedSample);
            await Check("Production application failure uses the same sanitized 500 response", async () =>
            {
                var result = await Send(client, HttpMethod.Get, "/api/v1/system/status");
                Problem(result, 500, "unexpected_error");
                Require(!result.Text.Contains("fixture", StringComparison.Ordinal), "Production exception details leaked.");
            });
        }
        await Check("Structured logs correlate errors/completions and omit all injected sensitive fixtures", () =>
        {
            var entries = logs.Entries.ToArray();
            Require(entries.Any(entry => entry.EventId == 1001) && entries.Any(entry => entry.EventId == 1000), "Safe events missing.");
            Require(entries.Where(entry => entry.EventId == 1000).All(entry => entry.State.ContainsKey("TraceId") && entry.State.ContainsKey("Route") && entry.State.ContainsKey("ElapsedMilliseconds")), "Structured fields missing.");
            foreach (var error in entries.Where(entry => entry.EventId == 1001))
            { Require(entries.Any(completed => completed.EventId == 1000 && Equals(completed.State["TraceId"], error.State["TraceId"])), "Failure/completion trace correlation missing."); }
            var rendered = JsonSerializer.Serialize(entries);
            Require(!rendered.Contains("fixture", StringComparison.Ordinal) && entries.All(entry => entry.Exception is null), "Sensitive log data found.");
            return Task.CompletedTask;
        });
        Console.WriteLine(JsonSerializer.Serialize(new { checked_at_utc = DateTimeOffset.UtcNow, scope = "Real loopback Kestrel HTTP checks with actual API composition; no database/provider/frontend calls", checks, chunked_overflow_observation = chunkedOverflow, all_hosts_stopped = true, passed = !failed }, new JsonSerializerOptions { WriteIndented = true }));
        return failed ? 1 : 0;
    }

    private static async Task<WebApplication> StartAsync(string environment, CapturedLogs logs, bool unhealthy = false, bool failSample = false)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = environment, ApplicationName = typeof(SystemController).Assembly.FullName });
        builder.Configuration.Sources.Clear();
        builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?> { ["Application:DisplayName"] = "GD Tutor", ["Application:PublicOrigin"] = "https://example.test", ["Application:DefaultTimeZone"] = "Asia/Kolkata" });
        builder.WebHost.UseUrls("http://127.0.0.1:0");
        builder.Host.UseDefaultServiceProvider(options => { options.ValidateScopes = true; options.ValidateOnBuild = true; });
        builder.Logging.ConfigureBackendLogging();
        builder.Logging.ClearProviders(); builder.Logging.AddProvider(logs);
        builder.Services.AddBackendFoundation(builder.Configuration);
        if (failSample) { builder.Services.Replace(ServiceDescriptor.Singleton<IFoundationSampleSource, FailingSampleSource>()); }
        builder.Services.AddBackendHttp(builder.Environment);
        if (unhealthy) { builder.Services.AddHealthChecks().AddCheck("unhealthy-fixture", () => HealthCheckResult.Unhealthy("health-fixture"), tags: ["ready"]); }
        var app = builder.Build(); app.UseBackendHttp();
        await app.StartAsync(); return app;
    }

    private static HttpClient Client(WebApplication app) => new(new HttpClientHandler { AllowAutoRedirect = false })
    { BaseAddress = new Uri(app.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()!.Addresses.Single()), Timeout = TimeSpan.FromSeconds(10) };
    private static async Task<Response> Post(HttpClient client, string body, string media = "application/json")
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/diagnostics/validation") { Content = new StringContent(body, Encoding.UTF8, media) };
        return await Send(client, request);
    }
    private static async Task<Response> Send(HttpClient client, HttpMethod method, string path)
    { using var request = new HttpRequestMessage(method, path); return await Send(client, request); }
    private static async Task<Response> Send(HttpClient client, HttpRequestMessage request)
    {
        using var response = await client.SendAsync(request);
        var text = await response.Content.ReadAsStringAsync();
        Require(response.Headers.CacheControl?.NoStore == true, "no-store missing.");
        Require(response.Headers.TryGetValues("X-Trace-Id", out var traces), "Trace header missing.");
        Require(!response.Headers.Contains("Server"), "Server header present.");
        return new Response((int)response.StatusCode, text, JsonDocument.Parse(text).RootElement.Clone(), traces!.Single(), response.Content.Headers.ContentType?.MediaType ?? "", response.Content.Headers.Allow.ToArray());
    }
    private static void Problem(Response response, int status, string code)
    {
        Require(response.Status == status, $"Expected {status}, received {response.Status}: {response.Text}");
        Require(response.MediaType == "application/problem+json", "Wrong problem content type.");
        Require(response.Json.GetProperty("status").GetInt32() == status && response.Json.GetProperty("code").GetString() == code, "Wrong problem status/code.");
        Require(response.Json.GetProperty("traceId").GetString() == response.TraceId, "Trace mismatch.");
        Require(response.Json.GetProperty("type").GetString() == "about:blank" && !response.Json.TryGetProperty("instance", out _), "Unsafe URL reflected.");
    }
    private static void Require(bool condition, string message) { if (!condition) { throw new InvalidOperationException(message); } }
    private sealed record Response(int Status, string Text, JsonElement Json, string TraceId, string MediaType, string[] Allow);
    private sealed class FailingSampleSource : IFoundationSampleSource
    {
        public ValueTask<string> ReadLabelAsync(CancellationToken cancellationToken = default) => throw new InvalidOperationException("production-exception-fixture");
    }

    private sealed class CapturedLogs : ILoggerProvider
    {
        public ConcurrentQueue<LogEntry> Entries { get; } = new();
        public ILogger CreateLogger(string categoryName) => new CaptureLogger(this, categoryName);
        public void Dispose() { }
    }
    private sealed class CaptureLogger(CapturedLogs owner, string category) : ILogger
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            var values = state is IEnumerable<KeyValuePair<string, object?>> pairs ? pairs.ToDictionary(pair => pair.Key, pair => pair.Value) : new();
            owner.Entries.Enqueue(new LogEntry(category, eventId.Id, formatter(state, exception), exception?.ToString(), values));
        }
    }
    private sealed record LogEntry(string Category, int EventId, string Message, string? Exception, Dictionary<string, object?> State);
}
