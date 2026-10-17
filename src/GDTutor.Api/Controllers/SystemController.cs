using GDTutor.Api.Contracts;
using GDTutor.Application.Foundation;
using Microsoft.AspNetCore.Mvc;

namespace GDTutor.Api.Controllers;

[ApiController]
[Route("api/v1/system")]
public sealed class SystemController(FoundationSampleService sampleService) : ControllerBase
{
    [HttpGet("status")]
    [EndpointSummary("Read the nonpersistent foundation sample and UTC server time.")]
    [ProducesResponseType<SystemStatusResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status500InternalServerError, "application/problem+json")]
    public async Task<ActionResult<SystemStatusResponse>> Status(CancellationToken cancellationToken)
    {
        var sample = await sampleService.ReadAsync(cancellationToken);
        return Ok(SystemStatusResponse.FromSample(sample));
    }
}
