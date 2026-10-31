param(
    [ValidateSet('private', 'public')]
    [string]$Visibility = 'private'
)
$ErrorActionPreference = 'Stop'
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is required.' }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is required. Install it, then run gh auth login.' }
& gh auth status
if ($LASTEXITCODE -ne 0) { throw 'GitHub CLI is not authenticated. Run: gh auth login' }
if (-not (Test-Path .git)) {
    & git init
    if ($LASTEXITCODE -ne 0) { throw 'git init failed.' }
}
& git add .
if ($LASTEXITCODE -ne 0) { throw 'git add failed.' }
& git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    & git commit -m 'feat: create original FireXCore Agent Orbs library'
    if ($LASTEXITCODE -ne 0) { throw 'git commit failed. Configure Git user.name and user.email.' }
}
& git branch -M main
if ($LASTEXITCODE -ne 0) { throw 'git branch failed.' }
$repo = 'FireXCore/agent-orbs'
& gh repo view $repo --json name --jq '.name' 2>$null
if ($LASTEXITCODE -eq 0) {
    & git remote get-url origin 2>$null
    if ($LASTEXITCODE -ne 0) { & git remote add origin ('https://github.com/' + $repo + '.git') }
    & git push -u origin main
} else {
    & gh repo create $repo ('--' + $Visibility) --source . --remote origin --push
}
if ($LASTEXITCODE -ne 0) { throw 'GitHub upload failed.' }
Write-Host ('Published repository: https://github.com/' + $repo)
