using GDTutor.Api.Composition;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ConfigureBackendLogging();
builder.Host.UseDefaultServiceProvider(options =>
{
    options.ValidateScopes = true;
    options.ValidateOnBuild = true;
});
builder.Services.AddBackendFoundation(builder.Configuration);
builder.Services.AddBackendHttp(builder.Environment);
await using var app = builder.Build();
app.UseBackendHttp();

try
{
    await app.RunAsync();
}
catch (OptionsValidationException)
{
    Console.Error.WriteLine("Application configuration validation failed. Review the Application settings before restarting.");
    Environment.ExitCode = 78;
}
