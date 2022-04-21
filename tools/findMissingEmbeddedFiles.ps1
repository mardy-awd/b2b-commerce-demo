$extensionsPath = (Split-Path $PSScriptRoot -Parent) + "\src\Extensions"
$extensionsCsProjPath = $extensionsPath + "\Extensions.csproj"

if (-not (Test-Path $extensionsCsProjPath)) {
    Write-Output "No file was found at $($extensionsCsProjPath)"
}

$extensionsCsProj = [xml](Get-Content $extensionsCsProjPath)
$embeddedResources = @()
foreach ($resource in $extensionsCsProj.Project.ItemGroup.EmbeddedResource) {
    if ($resource -eq $null) { 
        continue
    }
    $embeddedResources = $embeddedResources + [IO.Path]::Combine($extensionsPath, $resource.Attributes["Include"].Value)
}

Write-Output ""
Write-Output "The following files were on disk in the extensions project but not an embedded resource in the project"
Write-Output ""

foreach ($file in Get-ChildItem $extensionsPath -Recurse -Filter *.sql) {
    if (!$embeddedResources.Contains($file.FullName)) {
        Write-Output $file.FullName
    }
}

foreach ($file in Get-ChildItem $extensionsPath -Recurse -Filter *.json) {
    if ($file.FullName.Contains("\obj\")) {
        continue
    }
    if (!$embeddedResources.Contains($file.FullName)) {
        Write-Output $file.FullName
    }
}
