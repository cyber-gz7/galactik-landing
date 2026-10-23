Add-Type @'
using System;
using System.Text;
using System.Runtime.InteropServices;

public class WinCred {
    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", SetLastError = true)]
    public static extern void CredFree(IntPtr credentialPtr);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public long LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    public static string GetPassword(string target) {
        IntPtr ptr;
        if (CredRead(target, 1, 0, out ptr)) {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(ptr, typeof(CREDENTIAL));
            byte[] bytes = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, bytes, 0, cred.CredentialBlobSize);
            CredFree(ptr);
            try {
                string s = Encoding.UTF8.GetString(bytes);
                if (s.StartsWith("ghp_") || s.StartsWith("gho_") || s.StartsWith("github_pat_") || s.Length > 20) return s;
            } catch {}
            return Encoding.Unicode.GetString(bytes);
        }
        return null;
    }
}
'@

$token = [WinCred]::GetPassword('GitHub - https://api.github.com/cyber-gz7')
if (-not $token) {
    Write-Error "No se encontro el token en Credential Manager"
    exit 1
}

$env:GH_TOKEN = $token
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

$installer = "C:\Proyectos\GalacticLive\src-tauri\target\release\bundle\nsis\Galactik Live_2.1.4_x64-setup.exe"
$installerDot = "C:\Proyectos\GalacticLive\src-tauri\target\release\bundle\nsis\Galactik.Live_2.1.4_x64-setup.exe"

if (-not (Test-Path $installer)) {
    Write-Error "No existe el instalador en: $installer"
    exit 1
}

Copy-Item $installer $installerDot -Force

$hash = (Get-FileHash -Path $installerDot -Algorithm SHA256).Hash
Write-Host "Instalador SHA-256: $hash"

$notesFile = "C:\Proyectos\GalacticLive\scripts\release-notes-2.1.4.md"

Write-Host "Creando release v2.1.4 en cyber-gz7/galactik-landing..."
& "C:\Program Files\GitHub CLI\gh.exe" release create "v2.1.4" $installerDot --title "Galactik Live v2.1.4 - Roblox 1:1 Overlay & Custom Side Wins" --notes-file $notesFile --repo "cyber-gz7/galactik-landing"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Intentando upload/clobber de asset..."
    & "C:\Program Files\GitHub CLI\gh.exe" release upload "v2.1.4" $installerDot --clobber --repo "cyber-gz7/galactik-landing"
    & "C:\Program Files\GitHub CLI\gh.exe" release edit "v2.1.4" --title "Galactik Live v2.1.4 - Roblox 1:1 Overlay & Custom Side Wins" --notes-file $notesFile --repo "cyber-gz7/galactik-landing"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Release v2.1.4 publicado exitosamente en GitHub Releases!"
} else {
    Write-Host "ERROR: Fallo al publicar el release (codigo $LASTEXITCODE)"
}
