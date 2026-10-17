$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
if (![System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Windows) -or [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -ne 'X64') {
    throw 'This bootstrap is for Windows x64. Install the exact global.json SDK for your platform using the official .NET downloads.'
}
$admission = Get-Content -LiteralPath (Join-Path $repoRoot 'docs/reference/BACKEND-TOOLCHAIN.json') -Raw | ConvertFrom-Json
$pin = (Get-Content -LiteralPath (Join-Path $repoRoot 'global.json') -Raw | ConvertFrom-Json).sdk.version
if ($admission.sdk.version -ne $pin) { throw 'SDK pin and admission register differ.' }
$destination = Join-Path $repoRoot '.planning-review/dotnet'
if (Test-Path -LiteralPath $destination) {
    throw 'The local SDK directory already exists. Use it, or review/remove it explicitly before a fresh SDK bootstrap.'
}
$archiveDirectory = Join-Path $repoRoot '.planning-review/backend'
New-Item -ItemType Directory -Path $archiveDirectory -Force | Out-Null
$archivePath = Join-Path $archiveDirectory "dotnet-sdk-$pin-win-x64.zip"
if (!(Test-Path -LiteralPath $archivePath)) {
    Invoke-WebRequest -Uri $admission.sdk.windows_x64.url -OutFile $archivePath
}
$actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA512).Hash.ToLowerInvariant()
if ($actualHash -ne $admission.sdk.windows_x64.sha512) { throw 'SDK checksum mismatch; refusing extraction. Review the local archive before retrying.' }
Expand-Archive -LiteralPath $archivePath -DestinationPath $destination
Write-Output "Verified .NET SDK $pin extracted into the ignored project-local directory. No system installation was changed."
