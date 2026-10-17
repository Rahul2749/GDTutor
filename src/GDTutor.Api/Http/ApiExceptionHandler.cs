using Microsoft.AspNetCore.Diagnostics;

namespace GDTutor.Api.Http;

public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        var status = exception is BadHttpRequestException badRequest ? badRequest.StatusCode : StatusCodes.Status500InternalServerError;
        // Do not pass the exception object, message or request content to logging.
        logger.LogError(new EventId(1001, "RequestFailure"),
            "Request failed. Status {StatusCode} TraceId {TraceId}", status, context.TraceIdentifier);
        await ApiProblems.WriteAsync(context, status);
        return true;
    }
}
