export const VERSION_MC = '1.20.1';
export const API_PAPER_BUILDS = 'https://api.papermc.io/v2/projects/paper/versions/1.20.1/builds';

export async function fetchLatestPaper1201() {
  const res = await fetch(API_PAPER_BUILDS);
  if (!res.ok) throw new Error('No se pudo conectar con la API de PaperMC');
  const data = await res.json();
  const builds = data.builds || [];
  if (builds.length === 0) throw new Error('No se encontraron builds de Paper 1.20.1');
  const latestBuild = builds[builds.length - 1];
  const jarName = latestBuild.downloads.application.name;
  const downloadUrl = `https://api.papermc.io/v2/projects/paper/versions/1.20.1/builds/${latestBuild.build}/downloads/${jarName}`;
  return {
    build: latestBuild.build,
    jarName,
    downloadUrl
  };
}

export function generateServerProperties({
  motd = 'Servidor Galactic Live by GZ7',
  port = 25565,
  rconPort = 25575,
  rconPassword = 'gz7livepassword',
  isPremium = false,
  maxPlayers = 20,
  pvp = true,
  difficulty = 'normal',
  gamemode = 'survival'
}) {
  return `#Minecraft server properties generado por Galactic Live (GZ7)
enable-rcon=true
rcon.port=${rconPort}
rcon.password=${rconPassword}
broadcast-rcon-to-ops=false
server-port=${port}
online-mode=${isPremium ? 'true' : 'false'}
motd=${motd}
difficulty=${difficulty}
gamemode=${gamemode}
max-players=${maxPlayers}
pvp=${pvp}
allow-flight=true
view-distance=10
simulation-distance=8
level-name=world
spawn-protection=0
`;
}

export function generateEula() {
  return `#Aceptado automáticamente desde Galactic Live (GZ7)\neula=true\n`;
}

export function generateOpsJson(operatorNick) {
  if (!operatorNick || !operatorNick.trim()) return '[]\n';
  return JSON.stringify([
    {
      uuid: '00000000-0000-0000-0000-000000000000',
      name: operatorNick.trim(),
      level: 4,
      bypassesPlayerLimit: false
    }
  ], null, 2);
}

export function generateIniciarBat(ramGb = 4) {
  return `@echo off
TITLE Servidor Minecraft 1.20.1 - Galactic Live by GZ7
cd /d "%~dp0"
echo ==============================================
echo  Iniciando Servidor Paper 1.20.1 (${ramGb} GB RAM)
echo  RCON habilitado para Galactic Live (GZ7)
echo ==============================================
java -Xms${ramGb}G -Xmx${ramGb}G -XX:+UseG1GC -jar paper.jar --nogui
pause
`;
}

export async function instalarPluginsAutorizados(carpeta, onLog = () => {}) {
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  if (!invoke) {
    onLog('[ERROR] Requiere el binario compilado de Tauri para verificar autorización de plugins.');
    return null;
  }
  try {
    onLog('🔒 Verificando autorización de licencia para descarga/instalación de plugins .jar...');
    const report = await invoke('install_authorized_mc_plugins', { server_folder: carpeta });
    onLog(`✔ Autorización concedida: ${report.deployed_count} plugin(s) instalados en ${report.target_plugins_dir} con pase criptográfico activo.`);
    return report;
  } catch (err) {
    onLog(`⚠️ Plugins exclusivos bloqueados: ${err.message || err}`);
    return null;
  }
}

export async function crearServidorMinecraft({
  carpeta = 'C:\\ServidorMinecraft_GalacticLive',
  opNick = 'Streamer',
  modo = 'nopremium',
  ramGb = 4,
  rconPass = 'gz7livepassword',
  onLog = () => {}
} = {}) {
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  if (!invoke) {
    onLog('[ERROR] Función disponible únicamente en la aplicación de escritorio compilada Tauri.');
    return;
  }

  try {
    onLog(`[1/6] Consultando última build de Paper ${VERSION_MC}...`);
    const info = await fetchLatestPaper1201();
    onLog(`[2/6] Descargando ${info.jarName} (Build #${info.build})...`);

    const targetJar = `${carpeta.replace(/\\$/, '')}\\paper.jar`;
    await invoke('download_file', { url: info.downloadUrl, target_path: targetJar });

    onLog('[3/6] Escribiendo eula.txt y server.properties con RCON activo...');
    await invoke('write_server_file', { folder: carpeta, filename: 'eula.txt', content: generateEula() });

    const props = generateServerProperties({
      rconPassword: rconPass,
      isPremium: modo === 'premium'
    });
    await invoke('write_server_file', { folder: carpeta, filename: 'server.properties', content: props });

    onLog(`[4/6] Configurando OP (${opNick}) y script iniciar.bat (${ramGb} GB RAM)...`);
    await invoke('write_server_file', { folder: carpeta, filename: 'ops.json', content: generateOpsJson(opNick) });
    await invoke('write_server_file', { folder: carpeta, filename: 'iniciar.bat', content: generateIniciarBat(ramGb) });

    onLog('[5/6] Verificando permiso de descarga de plugins exclusivos de Minecraft...');
    await instalarPluginsAutorizados(carpeta, onLog);

    onLog(`✔ [6/6] ¡Servidor Paper 1.20.1 listo en: ${carpeta}! Haz clic en "Iniciar Servidor".`);
  } catch (err) {
    onLog(`[ERROR] ${err.message || err}`);
  }
}

export async function lanzarServidorMinecraft(carpeta, onLog = () => {}) {
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  if (!invoke) {
    onLog('[ERROR] Requiere entorno Tauri para lanzar iniciar.bat.');
    return;
  }
  try {
    await instalarPluginsAutorizados(carpeta, onLog);
    const msg = await invoke('launch_server_bat', { folder: carpeta });
    onLog(`✔ ${msg}`);
  } catch (err) {
    onLog(`[ERROR] ${err.message || err}`);
  }
}
