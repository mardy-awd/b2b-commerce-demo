$tempKeyPath = [System.IO.Path]::GetTempFileName()
$tempCertPath = [System.IO.Path]::GetTempFileName()
$tempPfxPath = [System.IO.Path]::GetTempFileName()

try
{
    #            var passwordPath = Path.Combine(Path.GetDirectoryName(outputPath), "InsiteIdentityPassword.txt");
    #           var certificatePassword = Membership.GeneratePassword(25, 0);
    #            var random = new Random();
    #            // some of the special characters membership.generatepassword generates screw up the commands below
    #           certificatePassword = Regex.Replace(certificatePassword, @"[^a-zA-Z0-9]", m => random.Next(9).ToString());

    $certificatePassword = [guid]::NewGuid().ToString().Replace("-", "")

    $sslPath = Join-Path $PSScriptRoot "OpenSSL"

    $Env:OPENSSL_CONF = "$($sslPath)\bin\openssl.cfg"

    & "$($sslPath)\bin\openssl.exe" req -new -newkey rsa:4096 -days 3650 -nodes -x509 -subj "/C=US/ST=MN/L=Minneapolis/O=Online/CN=insiteidentity" -keyout "$($tempKeyPath)" -out "$($tempCertPath)" 2>&1 | Out-Null
    & "$($sslPath)\bin\openssl.exe" pkcs12 -export -in "$($tempCertPath)" -inkey "$($tempKeyPath)" -out "$($tempPfxPath)" -password pass:$certificatePassword 2>&1 | Out-Null


    if (Test-Path $tempPfxPath)
    {

    }
    $fileLength = (Get-Item $tempPfxPath).Length

    if ($fileLength -gt 0)
    {
        $pfxPath = Join-Path $PSScriptRoot "insiteidentity.pfx"
        Copy-Item $tempPfxPath $pfxPath
        New-Item -Path $PSScriptRoot -Name "InsiteIdentityPassword.txt" -Value $certificatePassword -Force | Out-Null
        
        Write-Output "Successfully generated Identity PFX file. Follow the instructions below to install the file."
        Write-Output "1. Copy the insiteidentity.pfx file in the current directory to your {WebProjectFolder}/App_Data directory."
        Write-Output "2. Modify {WebProjectFolder}/config/appSettings.config. Set IdentityServerCertificatePassword to"
        Write-Output "   $($certificatePassword)"
    }
    else
    {
        Write-Output "Unexpected error occurred, unable to generate PFX file."

    }
}
finally
{
    Remove-Item $tempKeyPath
    Remove-Item $tempCertPath
    Remove-Item $tempPfxPath
}