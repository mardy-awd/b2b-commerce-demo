param(
    [Parameter(Mandatory=$true)]
    $githubToken
)

$versions = @("dev", "cloud-release")
if (-not (Test-Path "previous")) {
    New-Item -ItemType Directory -Path "previous"
}

foreach ($version in $versions) {
    $response = Invoke-RestMethod -Uri "http://ishq-buildserver.insitesofthosting.com:8111/guestAuth/app/rest/builds?locator=branch:$($version),status:SUCCESS,buildType:Insitecommerce_BlueprintBuilder"
    $id = $response.builds.FirstChild.Attributes["id"].Value

    $url = "http://ishq-buildserver.insitesofthosting.com:8111/repository/download/Insitecommerce_BlueprintBuilder/$($id):id/errors.json"

    Write-Output $url

    Invoke-WebRequest -Uri $url -OutFile "previous/$($version).json"
}

docker build . -f bb.Dockerfile --build-arg GITHUB_TOKEN=$githubToken -t blueprint-builder
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
docker create --name get-output blueprint-builder
docker cp get-output:/output .
docker rm get-output
