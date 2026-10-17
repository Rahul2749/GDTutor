$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$expected = [ordered]@{
    'GDTutor.Domain' = @()
    'GDTutor.Application' = @('GDTutor.Domain')
    'GDTutor.Infrastructure' = @('GDTutor.Application', 'GDTutor.Domain')
    'GDTutor.Api' = @('GDTutor.Application', 'GDTutor.Infrastructure')
}
$checks = @()
foreach ($name in $expected.Keys) {
    $path = Join-Path $repoRoot "src/$name/$name.csproj"
    [xml] $project = Get-Content -LiteralPath $path -Raw
    $references = @($project.SelectNodes('//ProjectReference') | ForEach-Object {
        [System.IO.Path]::GetFileNameWithoutExtension($_.Include)
    })
    $match = (($references | Sort-Object) -join ',') -eq (($expected[$name] | Sort-Object) -join ',')
    if (!$match) { throw "Unexpected reference graph in $name" }
    $direct = @($project.SelectNodes('//PackageReference'))
    if ($name -eq 'GDTutor.Api') {
        if ($direct.Count -ne 1 -or $direct[0].Include -ne 'Microsoft.AspNetCore.OpenApi' -or $direct[0].Version -ne '[10.0.13]') { throw 'Unexpected API package admission.' }
    } elseif ($direct.Count -ne 0) { throw "Unadmitted NuGet package in $name" }
    if ($name -ne 'GDTutor.Api' -and ($project.Project.Sdk -ne 'Microsoft.NET.Sdk' -or $project.SelectNodes('//FrameworkReference').Count -ne 0)) {
        throw "Unexpected web/framework reference in $name"
    }
    $assetsPath = Join-Path $repoRoot "src/$name/obj/project.assets.json"
    if (!(Test-Path -LiteralPath $assetsPath)) { throw "Restore $name before verifying its evaluated graph." }
    $assets = Get-Content -LiteralPath $assetsPath -Raw | ConvertFrom-Json
    $packages = @($assets.libraries.PSObject.Properties | Where-Object { $_.Value.type -eq 'package' })
    $packageIds = @($packages | ForEach-Object { $_.Name } | Sort-Object)
    $admittedIds = if ($name -eq 'GDTutor.Api') { @('Microsoft.AspNetCore.OpenApi/10.0.13', 'Microsoft.OpenApi/2.12.2') } else { @() }
    if (($packageIds -join ',') -ne (($admittedIds | Sort-Object) -join ',')) { throw "Unexpected restored NuGet graph in $name" }
    $lockPath = Join-Path $repoRoot "src/$name/packages.lock.json"
    if (!(Test-Path -LiteralPath $lockPath)) { throw "Missing lockfile for $name" }
    $checks += [ordered]@{ project = $name; references = $references; restored_nuget_packages = $packages.Count; passed = $true }
}

[xml] $solution = Get-Content -LiteralPath (Join-Path $repoRoot 'GDTutor.slnx') -Raw
if ($solution.SelectNodes('//Project').Count -ne 5) { throw 'Solution must contain four production projects and the foundation-check harness.' }
$allowedSources = @(
    'src/GDTutor.Application/Foundation/IFoundationSampleSource.cs',
    'src/GDTutor.Application/Foundation/FoundationSample.cs',
    'src/GDTutor.Application/Foundation/FoundationSampleService.cs',
    'src/GDTutor.Infrastructure/Foundation/InMemoryFoundationSampleSource.cs',
    'src/GDTutor.Api/Configuration/ApplicationOptions.cs',
    'src/GDTutor.Api/Configuration/ApplicationOptionsValidator.cs',
    'src/GDTutor.Api/Composition/BackendServices.cs',
    'src/GDTutor.Api/Program.cs',
    'src/GDTutor.Api/Composition/BackendHttp.cs',
    'src/GDTutor.Api/Contracts/HealthResponse.cs',
    'src/GDTutor.Api/Contracts/SystemStatusResponse.cs',
    'src/GDTutor.Api/Controllers/DevelopmentDiagnosticsController.cs',
    'src/GDTutor.Api/Controllers/HealthController.cs',
    'src/GDTutor.Api/Controllers/SystemController.cs',
    'src/GDTutor.Api/Http/ApiExceptionHandler.cs',
    'src/GDTutor.Api/Http/ApiProblems.cs',
    'src/GDTutor.Api/Http/DevelopmentDiagnosticsFeatureProvider.cs',
    'src/GDTutor.Api/Http/RequestLogMiddleware.cs'
)
$sources = @(Get-ChildItem -LiteralPath (Join-Path $repoRoot 'src') -Filter '*.cs' -Recurse | Where-Object { $_.FullName -notmatch '[\\/](obj|bin)[\\/]' } | ForEach-Object { [System.IO.Path]::GetRelativePath($repoRoot, $_.FullName).Replace('\', '/') })
if ((($sources | Sort-Object) -join ',') -ne (($allowedSources | Sort-Object) -join ',')) { throw 'Unexpected business/persistence source outside the authorized foundation services.' }
[xml] $testProject = Get-Content -LiteralPath (Join-Path $repoRoot 'tests/GDTutor.FoundationChecks/GDTutor.FoundationChecks.csproj') -Raw
if ($testProject.SelectNodes('//PackageReference').Count -ne 0 -or $testProject.SelectNodes('//ProjectReference').Count -ne 1 -or $testProject.SelectSingleNode('//ProjectReference').Include -ne '../../src/GDTutor.Api/GDTutor.Api.csproj') { throw 'Unexpected harness dependencies.' }
$testAssets = Get-Content -LiteralPath (Join-Path $repoRoot 'tests/GDTutor.FoundationChecks/obj/project.assets.json') -Raw | ConvertFrom-Json
if ((@($testAssets.libraries.PSObject.Properties | Where-Object { $_.Value.type -eq 'package' } | ForEach-Object { $_.Name } | Sort-Object) -join ',') -ne 'Microsoft.AspNetCore.OpenApi/10.0.13,Microsoft.OpenApi/2.12.2') { throw 'Unexpected harness NuGet graph.' }

$sourceHashes = [ordered]@{}
foreach ($relative in @('GDTutor.slnx', 'global.json', 'Directory.Build.props', 'NuGet.Config', 'docs/reference/BACKEND-TOOLCHAIN.json', 'tools/backend/Verify-Architecture.ps1', 'tools/backend/Verify-Startup.ps1', 'tools/backend/dotnet.ps1', 'tools/backend/Install-LocalSdk.ps1') + @($expected.Keys | ForEach-Object { "src/$_/$_.csproj"; "src/$_/packages.lock.json" }) + $allowedSources + @('src/GDTutor.Api/Properties/launchSettings.json', 'src/GDTutor.Api/appsettings.json', 'src/GDTutor.Api/appsettings.Development.json', 'tests/GDTutor.FoundationChecks/GDTutor.FoundationChecks.csproj', 'tests/GDTutor.FoundationChecks/Program.cs', 'tests/GDTutor.FoundationChecks/HttpChecks.cs', 'tests/GDTutor.FoundationChecks/packages.lock.json')) {
    $sourceHashes[$relative] = (Get-FileHash -LiteralPath (Join-Path $repoRoot $relative) -Algorithm SHA256).Hash.ToLowerInvariant()
}
$report = [ordered]@{
    checked_at_utc = [DateTime]::UtcNow.ToString('o')
    scope = '2.3.1: four production reference boundaries, one harness, two admitted OpenAPI packages at the API boundary, and authorized foundation HTTP source; no business/persistence entities.'
    checks = $checks
    solution_project_count = 5
    production_project_count = 4
    verification_project_count = 1
    handwritten_csharp_files = $allowedSources
    source_sha256 = $sourceHashes
    passed = $true
}
$report | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath (Join-Path $repoRoot 'docs/architecture/INTEGRATION-BACKEND-ARCHITECTURE-CHECKS.json') -Encoding utf8
Write-Output 'Architecture checks passed: four production projects, one harness, inward references, two admitted OpenAPI packages at the API boundary and foundation-only types.'
exit 0
