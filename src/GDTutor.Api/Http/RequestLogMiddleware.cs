using System.Diagnostics;
using Microsoft.AspNetCore.Routing;

namespace GDTutor.Api.Http;

public sealed class RequestLogMiddleware(RequestDelegate next, ILogger<RequestLogMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var started = Stopwatch.GetTimestamp();
        context.Response.OnStarting(() =>
        {
            context.Response.Headers["X-Trace-Id"] = context.TraceIdentifier;
            context.Response.Headers.CacheControl = "no-store";
            return Task.CompletedTask;
        });
        try { await next(context); }
        finally
        {
            var method = context.Request.Method is "GET" or "POST" or "PUT" or "PATCH" or "DELETE" or "HEAD" or "OPTIONS"
                ? context.Request.Method : "OTHER";
            var route = (context.GetEndpoint() as RouteEndpoint)?.RoutePattern.RawText ?? "<unmatched>";
            logger.LogInformation(new EventId(1000, "RequestCompleted"),
                "HTTP {Method} {Route} responded {StatusCode} in {ElapsedMilliseconds}ms TraceId {TraceId}",
                method, route, context.Response.StatusCode, Stopwatch.GetElapsedTime(started).TotalMilliseconds, context.TraceIdentifier);
        }
    }
}
