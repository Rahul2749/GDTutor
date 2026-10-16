param([string]$BrowserProbe = '')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
$probeRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$probeDir = Join-Path $probeRoot 'Project Files/Question Samples/clipboard-captures'
New-Item -ItemType Directory -Path $probeDir -Force | Out-Null
$wordProbe = $null
$sourceDocument = $null
$priorUpdateLinks = $null
try {
    # New automation instance; never attach to the user's open document.
    $wordProbe = New-Object -ComObject Word.Application
    $wordProbe.Visible = $false
    $wordProbe.DisplayAlerts = 0
    $wordProbe.AutomationSecurity = 3
    $priorUpdateLinks = $wordProbe.Options.UpdateLinksAtOpen
    $wordProbe.Options.UpdateLinksAtOpen = $false
    $probeFile = Join-Path $probeRoot 'Project Files/Question Samples/public-openxml/PUB-01.docx'
    $sourceManifest = Get-Content -LiteralPath (Join-Path $probeRoot 'docs/reference/PUBLIC-QUESTION-SOURCES.json') -Raw | ConvertFrom-Json
    $expectedSource = $sourceManifest.files | Where-Object id -eq 'PUB-01'
    if ((Get-FileHash -LiteralPath $probeFile -Algorithm SHA256).Hash.ToLower() -ne $expectedSource.sha256) { throw 'Public original checksum changed; aborting Word probe.' }
    $sourceDocument = $wordProbe.Documents.Open($probeFile, $false, $true, $false)
    $equationRange = $sourceDocument.OMaths.Item(1).Range
    $equationRange.Copy()
    Start-Sleep -Milliseconds 350
    $clipboardData = $null
    $clipboardError = $null
    for ($clipboardTry = 0; $clipboardTry -lt 6; $clipboardTry++) {
        try {
            [System.Windows.Forms.Application]::DoEvents()
            $clipboardData = [System.Windows.Forms.Clipboard]::GetDataObject()
            if ($clipboardData) { break }
        } catch { $clipboardError = $_.Exception.Message }
        Start-Sleep -Milliseconds 250
    }
    $formats = @()
    if ($clipboardData) { $formats = @($clipboardData.GetFormats($false)) }
    $payloads = @()
    foreach ($probeFormat in @('HTML Format', 'UnicodeText', 'Rich Text Format', 'MathML')) {
        if ($clipboardData -and $clipboardData.GetDataPresent($probeFormat, $false)) {
            $payload = $clipboardData.GetData($probeFormat, $false)
            if ($payload -is [string]) {
                $extension = @{ 'HTML Format' = 'html'; 'UnicodeText' = 'txt'; 'Rich Text Format' = 'rtf'; 'MathML' = 'mml' }[$probeFormat]
                $outFile = Join-Path $probeDir "word-pub01-equation-1.$extension"
                [IO.File]::WriteAllText($outFile, $payload, [Text.UTF8Encoding]::new($false))
                $payloads += @{ format = $probeFormat; local_file = "Project Files/Question Samples/clipboard-captures/word-pub01-equation-1.$extension"; characters = $payload.Length; sha256 = (Get-FileHash -LiteralPath $outFile -Algorithm SHA256).Hash.ToLower() }
            }
        }
    }
    $result = @{
        date = '2026-10-16'; source_id = 'PUB-01'; transfer = 'Native Word OMath.Range.Copy to Windows clipboard';
        word_version = $wordProbe.Version; word_build = $wordProbe.Build;
        word_file_version = (Get-Item (Join-Path $wordProbe.Path 'WINWORD.EXE')).VersionInfo.FileVersion;
        os_version = [Environment]::OSVersion.VersionString; source_equations = $sourceDocument.OMaths.Count;
        formats = $formats; payloads = $payloads; source_opened_read_only = $true;
        clipboard_error = $clipboardError;
        macros_disabled = $true; links_update_disabled = $true; ole_activated = $false;
        clipboard_contents = 'Only the explicitly copied public upstream fixture was inspected; prior clipboard contents were not read.'
    }
    if ($BrowserProbe) {
        & 'C:/Users/rahul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' $BrowserProbe
        if ($LASTEXITCODE -ne 0) { throw 'Browser clipboard probe failed.' }
    }
    # Preserve a native structural reference even when the execution desktop denies clipboard access.
    [IO.File]::WriteAllText((Join-Path $probeDir 'word-pub01-native.xml'), $sourceDocument.Content.WordOpenXML, [Text.UTF8Encoding]::new($false))
    $htmlOutput = Join-Path $probeDir 'word-pub01-export.html'
    $htmlFormat = 8
    try {
        $sourceDocument.SaveAs2([string]$htmlOutput, [int]$htmlFormat)
        $result.word_generated_html = 'Project Files/Question Samples/clipboard-captures/word-pub01-export.html'
    } catch { $result.html_export_error = $_.Exception.Message }
    $result.clipboard_status = $(if ($clipboardData) {'captured'} else {'unavailable_in_execution_desktop'})
    $result | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $probeRoot 'docs/reference/WORD-CLIPBOARD-PROBE.json') -Encoding utf8
    Write-Output ([pscustomobject]$result | Select-Object word_version,word_build,source_equations,formats | ConvertTo-Json -Depth 3)
} finally {
    $saveNone = 0
    if ($sourceDocument) { try { $sourceDocument.Close([ref]$saveNone) } catch { Write-Warning $_.Exception.Message } }
    if ($wordProbe) { if ($null -ne $priorUpdateLinks) { $wordProbe.Options.UpdateLinksAtOpen = $priorUpdateLinks }; try { $wordProbe.Quit([ref]$saveNone) } catch { Write-Warning $_.Exception.Message }; [void][Runtime.InteropServices.Marshal]::ReleaseComObject($wordProbe) }
}
