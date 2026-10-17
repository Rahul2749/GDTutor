using GDTutor.Api.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace GDTutor.Api.Controllers;

[ApiController]
[Route("health")]
public sealed class HealthController(HealthCheckService healthChecks) : ControllerBase
{
    [HttpGet("live")]
    [EndpointSummary("Process liveness only; no database or provider probe.")]
    [ProducesResponseType<HealthResponse>(StatusCodes.Status200OK)]
    public ActionResult<HealthResponse> Live() => Ok(new HealthResponse("healthy", "process", false));

    [HttpGet("ready")]
    [EndpointSummary("Foundation readiness only; external dependencies are not yet integrated or verified.")]
    [ProducesResponseType<HealthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<HealthResponse>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthResponse>> Ready(CancellationToken cancellationToken)
    {
        var report = await healthChecks.CheckHealthAsync(check => check.Tags.Contains("ready"), cancellationToken);
        // Never serialize descriptions, exceptions, data or individual dependency names.
        return StatusCode(report.Status == HealthStatus.Healthy ? 200 : 503,
            new HealthResponse(report.Status == HealthStatus.Healthy ? "healthy" : "unhealthy", "foundation", false));
    }
}
