# Keep native CLI arguments verbatim. An advanced-script parameter binder would
# consume dotnet flags such as -o as PowerShell common-parameter abbreviations.
$DotNetArguments = @($args)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$pin = (Get-Content -LiteralPath (Join-Path $repoRoot 'global.json') -Raw | ConvertFrom-Json).sdk.version
$localExecutable = Join-Path $repoRoot '.planning-review/dotnet/dotnet.exe'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE = '1'
$env:DOTNET_NOLOGO = '1'
$env:DOTNET_GENERATE_ASPNET_CERTIFICATE = 'false'
$env:DOTNET_CLI_WORKLOAD_UPDATE_NOTIFY_DISABLE = '1'
$env:DOTNET_CLI_HOME = Join-Path $repoRoot '.planning-review/dotnet-home'
$env:NUGET_PACKAGES = Join-Path $repoRoot '.planning-review/nuget-packages'
$env:NUGET_HTTP_CACHE_PATH = Join-Path $repoRoot '.planning-review/nuget-http'

if (Test-Path -LiteralPath $localExecutable) {
    $executable = $localExecutable
    $env:DOTNET_ROOT = Split-Path -Parent $executable
} else {
    $installed = Get-Command dotnet -ErrorAction SilentlyContinue
    if (!$installed) { throw 'Install the admitted SDK or run tools/backend/Install-LocalSdk.ps1 first.' }
    $executable = $installed.Source
}

Push-Location $repoRoot
try {
    $version = & $executable --version
    if ($LASTEXITCODE -ne 0 -or $version.Trim() -ne $pin) {
        throw "SDK $pin is required. Run tools/backend/Install-LocalSdk.ps1 for the project-local Windows x64 SDK."
    }
    & $executable @DotNetArguments
    $commandExitCode = $LASTEXITCODE
} finally {
    Pop-Location
}
exit $commandExitCode
