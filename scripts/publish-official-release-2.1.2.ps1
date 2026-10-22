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

$installer = "C:\Proyectos\GalacticLive\src-tauri\target\release\bundle\nsis\Galactik Live_2.1.2_x64-setup.exe"
$installerDot = "C:\Proyectos\GalacticLive\src-tauri\target\release\bundle\nsis\Galactik.Live_2.1.2_x64-setup.exe"

if (-not (Test-Path $installer)) {
    Write-Error "No existe el instalador en: $installer"
    exit 1
}

Copy-Item $installer $installerDot -Force

$notes = "## Galactik Live v2.1.2 (Official Release)`n`n- Panel de Control de Cuentas & Licencias para Streamers: Aprobacion en 1 clic de solicitudes pendientes vinculadas a Supabase.`n- Visualizacion y Acceso Directo: Entrada directa desde el sidebar ('Panel de Cuentas' y 'Licencias & HWID') y desde la barra superior ('Gestion de Licencias').`n- Desbloqueo y Permisos: Garantia de visualizacion inmediata para el fundador (gerardyabdiel09@gmail.com / GZ7_ADMIN).`n- Notificacion OTA: Activacion de la pildora de actualizacion en tiempo real dentro del panel.`n- Firma Digital Authenticode: Propiedad Intelectual verificada por CyberGZ7 - CJ7TEC.`n- Checksum SHA-256: 28ad00f9c6ed5647895332247cf37b549aa6a1c2ea84a8e5407a17c158c303f2"

Write-Host "Actualizando asset v2.1.2 en cyber-gz7/galactik-landing..."
& "C:\Program Files\GitHub CLI\gh.exe" release upload "v2.1.2" $installerDot --clobber --repo "cyber-gz7/galactik-landing"

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Asset v2.1.2 subido exitosamente en GitHub Releases!"
} else {
    Write-Host "ERROR: gh release fallo con codigo $LASTEXITCODE"
}
