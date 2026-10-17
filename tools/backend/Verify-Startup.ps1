$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$executable = Join-Path $repoRoot '.planning-review/dotnet/dotnet.exe'
$publishDirectory = Join-Path $repoRoot '.planning-review/backend/publish'
$assembly = Join-Path $publishDirectory 'GDTutor.Api.dll'
if (!(Test-Path -LiteralPath $executable) -or !(Test-Path -LiteralPath $assembly)) { throw 'Publish the current API with the admitted SDK before this startup check.' }
if (Get-NetTCPConnection -State Listen -LocalPort 5081 -ErrorAction SilentlyContinue) { throw 'Port 5081 is occupied; refusing to interrupt another process.' }
$env:DOTNET_ROOT = Split-Path -Parent $executable
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_NOLOGO = '1'
$originalEnvironment = $env:ASPNETCORE_ENVIRONMENT
$originalOrigin = $env:Application__PublicOrigin
$checks = @()
function Read-ResponseJson($response) {
    $content = if ($response.Content -is [byte[]]) { [System.Text.Encoding]::UTF8.GetString($response.Content) } else { [string]$response.Content }
    return $content | ConvertFrom-Json
}
try {
    foreach ($case in @(
        @{ Name = 'Development JSON configuration'; Environment = 'Development'; Origin = $null; ExpectFailure = $false },
        @{ Name = 'Production environment override'; Environment = 'Production'; Origin = 'https://preview.example.test'; ExpectFailure = $false },
        @{ Name = 'Production invalid configuration fails before listening'; Environment = 'Production'; Origin = 'https://user:configuration-fixture@example.test'; ExpectFailure = $true }
    )) {
        $env:ASPNETCORE_ENVIRONMENT = $case.Environment
        $env:Application__PublicOrigin = $case.Origin
        $caseId = $checks.Count
        $stdout = Join-Path $repoRoot ".planning-review/backend/startup-$caseId.stdout.log"
        $stderr = Join-Path $repoRoot ".planning-review/backend/startup-$caseId.stderr.log"
        $process = Start-Process -FilePath $executable -ArgumentList @(('"{0}"' -f $assembly), '--urls', 'http://127.0.0.1:5081') -WorkingDirectory $publishDirectory -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
        try {
            if ($case.ExpectFailure) {
                if (!$process.WaitForExit(8000)) { throw 'Invalid configuration did not stop startup.' }
                if ($process.ExitCode -ne 78) { throw 'Invalid configuration did not return the expected configuration-error code.' }
                $logs = (Get-Content -LiteralPath $stdout, $stderr -Raw) -join "`n"
                if ($logs -notmatch 'OptionsValidationException' -or $logs.Contains('configuration-fixture')) { throw 'Invalid startup diagnostics are missing or disclose the rejected value.' }
                if (Get-NetTCPConnection -State Listen -OwningProcess $process.Id -ErrorAction SilentlyContinue) { throw 'Invalid host accepted requests.' }
                $checks += @{ name = $case.Name; passed = $true; exit_code = 78; rejected_value_not_logged = $true; stopped = $true }
            } else {
                $response = $null
                for ($attempt = 0; $attempt -lt 40; $attempt++) {
                    if ($process.HasExited) { throw 'The API exited before accepting requests.' }
                    try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:5081/' -SkipHttpErrorCheck -TimeoutSec 2; break }
                    catch { Start-Sleep -Milliseconds 100 }
                }
                if (!$response -or $response.StatusCode -ne 404 -or (Read-ResponseJson $response).code -ne 'not_found') { throw 'Unmapped root must return a safe 404 problem.' }
                $statusResponse = Invoke-WebRequest -Uri 'http://127.0.0.1:5081/api/v1/system/status' -SkipHttpErrorCheck -TimeoutSec 2
                if ($statusResponse.StatusCode -ne 200 -or !(Read-ResponseJson $statusResponse).isDemonstration) { throw 'Status must return the demonstration DTO.' }
                $health = Invoke-WebRequest -Uri 'http://127.0.0.1:5081/health/ready' -SkipHttpErrorCheck -TimeoutSec 2
                if ($health.StatusCode -ne 200 -or (Read-ResponseJson $health).dependenciesVerified) { throw 'Readiness must remain foundation-only.' }
                $docs = Invoke-WebRequest -Uri 'http://127.0.0.1:5081/openapi/v1.json' -SkipHttpErrorCheck -TimeoutSec 2
                if ($case.Environment -eq 'Development') {
                    if ($docs.StatusCode -ne 200) { throw 'Development OpenAPI missing.' }
                    $failure = Invoke-WebRequest -Uri 'http://127.0.0.1:5081/api/v1/diagnostics/failure?token=startup-query-fixture' -Headers @{ Authorization = 'Bearer startup-header-fixture' } -SkipHttpErrorCheck -TimeoutSec 2
                    $problem = Read-ResponseJson $failure
                    if ($failure.StatusCode -ne 500 -or $problem.code -ne 'unexpected_error' -or $problem.traceId -ne $failure.Headers['X-Trace-Id'][0]) { throw 'Published failure response/correlation incorrect.' }
                } elseif ($docs.StatusCode -ne 404) { throw 'Production OpenAPI must not be exposed.' }
                Start-Sleep -Milliseconds 100
                $logLines = @(Get-Content -LiteralPath $stdout | Where-Object { $_.Trim() })
                $events = @($logLines | ForEach-Object { $_ | ConvertFrom-Json })
                if (!($events | Where-Object { $_.EventId -eq 1000 -and $_.State.TraceId })) { throw 'JSON request logs missing.' }
                if (($logLines -join "`n") -match 'startup-query-fixture|startup-header-fixture|controlled-exception-fixture') { throw 'Fixture content leaked into published logs.' }
                $listeners = @(Get-NetTCPConnection -State Listen -OwningProcess $process.Id)
                if ($listeners.Count -ne 1 -or $listeners[0].LocalAddress -ne '127.0.0.1') { throw 'Unexpected listen address.' }
                $checks += @{ name = $case.Name; passed = $true; root_status = 404; status_endpoint = 200; readiness = 200; openapi_status = $docs.StatusCode; json_logs_sanitized = $true; listener = '127.0.0.1:5081'; stopped = $true }
            }
        } finally {
            if (!$process.HasExited) { Stop-Process -Id $process.Id; $process.WaitForExit(5000) | Out-Null }
        }
        if (!$process.HasExited) { throw 'Verification process did not stop.' }
    }
} finally {
    $env:ASPNETCORE_ENVIRONMENT = $originalEnvironment
    $env:Application__PublicOrigin = $originalOrigin
}
$report = [ordered]@{
    checked_at_utc = [DateTime]::UtcNow.ToString('o')
    scope = '2.2.3 published HTTP API; Development endpoints/generated docs/safe failure and JSON logs, Production hidden docs, invalid configuration fail-fast. No database/provider/auth/load test.'
    checks = $checks
    assembly_sha256 = (Get-FileHash -LiteralPath $assembly -Algorithm SHA256).Hash.ToLowerInvariant()
    script_sha256 = (Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()
    all_processes_stopped = $true
    passed = $true
}
$report | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath (Join-Path $repoRoot 'docs/architecture/BACKEND-HTTP-STARTUP-CHECKS.json') -Encoding utf8
Write-Output 'Published startup checks passed: Development, Production override and fail-fast invalid configuration; all processes stopped.'
exit 0
