# This script is used to validate references for partner Extensions projects to warn them before pushing a new revision into the cloud builds if they use an invalid reference.
param (
    [Parameter(Mandatory=$True)][string]$projectPath
)

$disallowedReferences = @()

[xml]$projectContent = Get-Content -Path $projectPath
if ($projectContent.Project.Sdk -ne "") {
    foreach($itemGroup in $projectContent.Project.ItemGroup) {
        foreach($packageReference in $itemGroup.PackageReference) {
            if ($packageReference.Include -ne "Insite.Commerce.Public") {
                $disallowedReferences += $packageReference.Include
            }
        }
    }

    if ($disallowedReferences.Count -gt 0) {
        $vsFormattedErrorOutput = $disallowedReferences -join "`n : error: "
        Write-Host " : error: Found $($disallowedReferences.Count) disallowed reference(s).`n : error: $vsFormattedErrorOutput"
        exit 1
    }
}

exit 0
