namespace GDTutor.Api.Contracts;

public sealed record HealthResponse(string Status, string Scope, bool DependenciesVerified);
