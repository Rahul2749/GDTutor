using System.Text.Json.Serialization;
using GDTutor.Api.Controllers;
using GDTutor.Api.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi;

namespace GDTutor.Api.Composition;

public static class BackendHttp
{
    public const long FoundationBodyLimit = 64 * 1024;

    public static void ConfigureBackendLogging(this ILoggingBuilder logging)
    {
        logging.ClearProviders();
        logging.AddJsonConsole(options => { options.IncludeScopes = false; options.UseUtcTimestamp = true; options.TimestampFormat = "O"; });
        logging.AddFilter("Microsoft.AspNetCore", LogLevel.None);
        logging.AddFilter("Microsoft.Extensions.Diagnostics.HealthChecks", LogLevel.None);
        logging.AddFilter("GDTutor.Api", LogLevel.Information);
    }

    public static IServiceCollection AddBackendHttp(this IServiceCollection services, IHostEnvironment environment)
    {
        services.AddProblemDetails(options => options.CustomizeProblemDetails = context =>
        {
            var safe = ApiProblems.Create(context.HttpContext, context.ProblemDetails.Status ?? 500);
            context.ProblemDetails.Type = safe.Type;
            context.ProblemDetails.Title = safe.Title;
            context.ProblemDetails.Detail = null;
            context.ProblemDetails.Instance = null;
            context.ProblemDetails.Extensions.Clear();
            foreach (var extension in safe.Extensions) { context.ProblemDetails.Extensions[extension.Key] = extension.Value; }
        });
        services.AddExceptionHandler<ApiExceptionHandler>();
        services.AddControllers(options => options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ProblemDetails), 500, "application/problem+json")))
            .AddApplicationPart(typeof(SystemController).Assembly)
            .ConfigureApplicationPartManager(manager => manager.FeatureProviders.Add(new DevelopmentDiagnosticsFeatureProvider(environment.IsDevelopment())))
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.MaxDepth = 32;
                options.JsonSerializerOptions.UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow;
            });
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = ApiProblems.Validation;
            options.SuppressMapClientErrors = true;
        });
        services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
        {
            options.AddServerHeader = false;
            options.Limits.MaxRequestBodySize = FoundationBodyLimit;
        });
        services.AddHealthChecks().AddCheck("foundation", () => HealthCheckResult.Healthy(), tags: ["ready"]);
        services.AddOpenApi("v1", options =>
        {
            options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_0;
            options.AddSchemaTransformer((schema, context, _) =>
            {
                if (context.JsonTypeInfo.Type == typeof(ProblemDetails))
                {
                    schema.Properties ??= new Dictionary<string, IOpenApiSchema>();
                    schema.Properties["code"] = new OpenApiSchema { Type = JsonSchemaType.String };
                    schema.Properties["traceId"] = new OpenApiSchema { Type = JsonSchemaType.String };
                    schema.Properties["errors"] = new OpenApiSchema
                    {
                        Type = JsonSchemaType.Object,
                        AdditionalProperties = new OpenApiSchema { Type = JsonSchemaType.Array, Items = new OpenApiSchema { Type = JsonSchemaType.String } }
                    };
                }
                return Task.CompletedTask;
            });
            options.AddOperationTransformer((operation, _, _) =>
            {
                foreach (var response in operation.Responses?.Values.OfType<OpenApiResponse>() ?? [])
                {
                    response.Headers ??= new Dictionary<string, IOpenApiHeader>();
                    response.Headers["X-Trace-Id"] = new OpenApiHeader { Description = "Server-generated request identifier, also present in errors and safe logs.", Schema = new OpenApiSchema { Type = JsonSchemaType.String } };
                    response.Headers["Cache-Control"] = new OpenApiHeader { Description = "no-store", Schema = new OpenApiSchema { Type = JsonSchemaType.String } };
                }
                return Task.CompletedTask;
            });
            options.AddDocumentTransformer((document, _, _) =>
            {
                document.Info.Title = "GD Tutor foundation API";
                document.Info.Version = "v1";
                document.Info.Description = "Nonpersistent foundation only. Development diagnostics save nothing. No authentication, database, payment or storage integration yet. Responses use no-store and X-Trace-Id; errors include code and traceId extensions.";
                // Do not reflect the incoming Host header into the saved contract.
                document.Servers = [];
                return Task.CompletedTask;
            });
        });
        return services;
    }

    public static WebApplication UseBackendHttp(this WebApplication app)
    {
        app.UseMiddleware<RequestLogMiddleware>();
        app.UseExceptionHandler(new ExceptionHandlerOptions { SuppressDiagnosticsCallback = _ => true });
        app.UseStatusCodePages(context => ApiProblems.WriteAsync(context.HttpContext, context.HttpContext.Response.StatusCode));
        app.Use(async (context, next) =>
        {
            if (context.Request.ContentLength > FoundationBodyLimit) { await ApiProblems.WriteAsync(context, 413); return; }
            await next(context);
        });
        app.MapControllers();
        if (app.Environment.IsDevelopment()) { app.MapOpenApi(); }
        return app;
    }
}
