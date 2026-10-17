using GDTutor.Api.Configuration;
using GDTutor.Application.Foundation;
using GDTutor.Infrastructure.Foundation;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace GDTutor.Api.Composition;

public static class BackendServices
{
    public static IServiceCollection AddBackendFoundation(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<ApplicationOptions>()
            .Configure(options =>
            {
                try
                {
                    configuration.GetSection(ApplicationOptions.SectionName).Bind(options, binder => binder.ErrorOnUnknownConfiguration = true);
                }
                catch (InvalidOperationException)
                {
                    throw new OptionsValidationException(Options.DefaultName, typeof(ApplicationOptions),
                        ["Application configuration contains unknown or unsupported settings."]);
                }
            })
            .ValidateDataAnnotations()
            .ValidateOnStart();
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IValidateOptions<ApplicationOptions>, ApplicationOptionsValidator>());

        services.TryAddSingleton<TimeProvider>(TimeProvider.System);
        services.TryAddSingleton<IFoundationSampleSource>(provider =>
            new InMemoryFoundationSampleSource(provider.GetRequiredService<IOptions<ApplicationOptions>>().Value.DisplayName));
        services.TryAddScoped<FoundationSampleService>();
        return services;
    }
}
