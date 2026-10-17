using System.ComponentModel.DataAnnotations;
using GDTutor.Api.Contracts;
using GDTutor.Application.Foundation;
using Microsoft.AspNetCore.Mvc;

namespace GDTutor.Api.Controllers;

// Removed from MVC discovery outside Development, not merely hidden from docs.
[ApiController]
[Route("api/v1/diagnostics")]
public sealed class DevelopmentDiagnosticsController(FoundationSampleService sampleService) : ControllerBase
{
    [HttpGet("delay")]
    [EndpointSummary("Development-only sample read delayed by two seconds; cancellation is honored and nothing is saved.")]
    [ProducesResponseType<SystemStatusResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<SystemStatusResponse>> Delay(CancellationToken cancellationToken)
    {
        await Task.Delay(TimeSpan.FromSeconds(2), cancellationToken);
        return Ok(SystemStatusResponse.FromSample(await sampleService.ReadAsync(cancellationToken)));
    }

    [HttpPost("validation")]
    [EndpointSummary("Development-only input validation demonstration; saves nothing.")]
    [Consumes("application/json")]
    [ProducesResponseType<ValidationDemoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status413PayloadTooLarge, "application/problem+json")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status415UnsupportedMediaType, "application/problem+json")]
    public ActionResult<ValidationDemoResponse> Validate(ValidationDemoRequest request) => Ok(new ValidationDemoResponse(true, true));

    [HttpGet("failure")]
    [EndpointSummary("Development-only controlled exception to inspect safe error handling.")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status500InternalServerError, "application/problem+json")]
    public IActionResult Failure() => throw new InvalidOperationException("controlled-exception-fixture");
}

public sealed class ValidationDemoRequest
{
    [Required, StringLength(80, MinimumLength = 1)]
    public string Label { get; init; } = "";
}

public sealed record ValidationDemoResponse(bool Accepted, bool IsDemonstration);
