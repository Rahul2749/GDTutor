using GDTutor.Api.Controllers;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace GDTutor.Api.Http;

internal sealed class DevelopmentDiagnosticsFeatureProvider(bool enabled) : IApplicationFeatureProvider<ControllerFeature>
{
    public void PopulateFeature(IEnumerable<ApplicationPart> parts, ControllerFeature feature)
    {
        if (!enabled)
        {
            var diagnostics = feature.Controllers.SingleOrDefault(type => type.AsType() == typeof(DevelopmentDiagnosticsController));
            if (diagnostics is not null) { feature.Controllers.Remove(diagnostics); }
        }
    }
}
