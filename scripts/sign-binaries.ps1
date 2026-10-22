$cert = Get-Item "Cert:\CurrentUser\My\ABBD23A9CF4F4B651537E1CDB9119A17E8122AE5"
Write-Host "Usando certificado: $($cert.Subject)"

$filesToSign = @(
    "C:\Proyectos\GalacticLive\src-tauri\target\release\gz7live.exe",
    "C:\Proyectos\GalacticLive\src-tauri\target\release\bundle\nsis\Galactik Live_2.1.3_x64-setup.exe",
    "C:\Proyectos\GalacticLive\src-tauri\target\release\bundle\nsis\Galactik.Live_2.1.3_x64-setup.exe"
)

foreach ($file in $filesToSign) {
    if (Test-Path $file) {
        Write-Host "Firmando con Authenticode: $file"
        try {
            $sig = Set-AuthenticodeSignature -FilePath $file -Certificate $cert -TimestampServer "http://timestamp.digicert.com" -HashAlgorithm SHA256 -ErrorAction Stop
        } catch {
            Write-Warning "Fallo timestamp Digicert, firmando directamente: $_"
            $sig = Set-AuthenticodeSignature -FilePath $file -Certificate $cert -HashAlgorithm SHA256
        }
        $check = Get-AuthenticodeSignature -FilePath $file
        Write-Host "Archivo: $(Split-Path $file -Leaf)"
        Write-Host "Status: $($check.Status)"
        Write-Host "StatusMessage: $($check.StatusMessage)"
        Write-Host "Firmante: $($check.SignerCertificate.Subject)"
        Write-Host "Emisor: $($check.SignerCertificate.Issuer)"
        Write-Host "----------------------------------------"
    } else {
        Write-Warning "No existe el archivo: $file"
    }
}
