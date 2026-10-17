using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace GDTutor.Api.Http;

public static class ApiProblems
{
    public static ProblemDetails Create(HttpContext context, int status, string? code = null)
    {
        var problem = new ProblemDetails
        {
            Type = "about:blank",
            Title = ReasonPhrases.GetReasonPhrase(status),
            Status = status
        };
        problem.Extensions["code"] = code ?? status switch
        {
            400 => "invalid_request",
            401 => "authentication_required",
            403 => "access_denied",
            404 => "not_found",
            405 => "method_not_allowed",
            413 => "payload_too_large",
            415 => "unsupported_media_type",
            503 => "service_unavailable",
            _ => status >= 500 ? "unexpected_error" : "request_failed"
        };
        problem.Extensions["traceId"] = context.TraceIdentifier;
        return problem;
    }

    public static IActionResult Validation(ActionContext action)
    {
        if (action.ModelState.Values.SelectMany(value => value.Errors).Any(error => IsBodyTooLarge(error.Exception)))
        {
            return Result(Create(action.HttpContext, StatusCodes.Status413PayloadTooLarge));
        }
        // Only known DTO member names may reach a response. Binder keys/messages can
        // contain attacker-controlled JSON paths, rejected values or type details.
        var fields = action.ActionDescriptor.Parameters
            .SelectMany(parameter => parameter.ParameterType.GetProperties())
            .Select(property => JsonNamingPolicy.CamelCase.ConvertName(property.Name))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var errors = new Dictionary<string, string[]>(StringComparer.Ordinal);
        foreach (var entry in action.ModelState.Where(entry => entry.Value?.Errors.Count > 0))
        {
            var field = fields.FirstOrDefault(field => field.Equals(entry.Key, StringComparison.OrdinalIgnoreCase)) ?? "request";
            errors[field] = ["Enter a valid value."];
        }
        var problem = Create(action.HttpContext, StatusCodes.Status400BadRequest, "validation_failed");
        problem.Extensions["errors"] = errors;
        return Result(problem);
    }

    private static bool IsBodyTooLarge(Exception? error) => error is not null &&
        (error is BadHttpRequestException { StatusCode: 413 } || IsBodyTooLarge(error.InnerException));

    private static ObjectResult Result(ProblemDetails problem)
    {
        var result = new ObjectResult(problem) { StatusCode = problem.Status };
        result.ContentTypes.Add("application/problem+json");
        return result;
    }

    public static Task WriteAsync(HttpContext context, int status) =>
        Results.Problem(Create(context, status)).ExecuteAsync(context);
}
