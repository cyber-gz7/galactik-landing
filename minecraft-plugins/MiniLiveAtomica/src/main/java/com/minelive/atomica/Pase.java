/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.bukkit.Bukkit
 *  org.bukkit.World
 *  org.bukkit.command.CommandSender
 *  org.bukkit.event.EventHandler
 *  org.bukkit.event.EventPriority
 *  org.bukkit.event.Listener
 *  org.bukkit.event.server.RemoteServerCommandEvent
 *  org.bukkit.event.server.ServerCommandEvent
 *  org.bukkit.plugin.Plugin
 *  org.bukkit.plugin.java.JavaPlugin
 */
package com.minelive.atomica;

import java.lang.management.ManagementFactory;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Locale;
import org.bukkit.Bukkit;
import org.bukkit.World;
import org.bukkit.command.CommandSender;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.server.RemoteServerCommandEvent;
import org.bukkit.event.server.ServerCommandEvent;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

final class Pase
implements Listener {
    private static final Modo DE_FABRICA;
    private static final String CLAVE_PUBLICA = "MCowBQYDK2VwAyEAWajq12mszh3Iu8Qaa/hauBvs8oMGNcB609xmdRmd6mA=";
    private static final String ORDEN = "mlpase";
    private static final String PREFIJO = "minelive-pase-v1";
    private static final long AVISAR_CADA_NANOS = 600000000000L;
    private static JavaPlugin plugin;
    private static PublicKey clave;
    private static String servidor;
    private static Modo modo;
    private static boolean hayPase;
    private static long caducaNanos;
    private static long ultimoEmitido;
    private static int sinPase;
    private static boolean avisado;
    private static long ultimoAvisoNanos;

    static void iniciar(JavaPlugin p) {
        plugin = p;
        try {
            byte[] der = Base64.getDecoder().decode(CLAVE_PUBLICA);
            clave = KeyFactory.getInstance("Ed25519").generatePublic(new X509EncodedKeySpec(der));
        }
        catch (Exception ex) {
            clave = null;
            p.getLogger().warning("Pase de MineLive no disponible en este Java: " + ex.getMessage());
        }
        p.getServer().getPluginManager().registerEvents((Listener)new Pase(), (Plugin)p);
    }

    static boolean permitir(CommandSender quien, String show) {
        if (plugin == null || clave == null) {
            return true;
        }
        if (hayPase && System.nanoTime() - caducaNanos < 0L) {
            return true;
        }
        if (modo == Modo.APAGADO) {
            return true;
        }
        ++sinPase;
        if (modo == Modo.ESTRICTO) {
            String texto = "MineLive: \u00ab" + show + "\u00bb no puede salir: este servidor no tiene un pase vigente. Abre la app de MineLive con tu cuenta activa y vuelve a intentarlo.";
            quien.sendMessage(texto);
            Pase.avisar(texto);
            return false;
        }
        Pase.avisar("Sin pase de MineLive (modo aviso): \u00ab" + show + "\u00bb sale igual. Con la app de MineLive abierta y tu cuenta activa este aviso no aparece.");
        return true;
    }

    private static void avisar(String texto) {
        long ahora = System.nanoTime();
        if (avisado && ahora - ultimoAvisoNanos < 600000000000L) {
            return;
        }
        avisado = true;
        ultimoAvisoNanos = ahora;
        plugin.getLogger().warning(texto);
    }

    private static String servidor() {
        if (servidor == null && !Bukkit.getWorlds().isEmpty()) {
            try {
                String base = "minelive-pase|" + ManagementFactory.getRuntimeMXBean().getStartTime() + "|" + String.valueOf(((World)Bukkit.getWorlds().get(0)).getUID());
                byte[] h = MessageDigest.getInstance("SHA-256").digest(base.getBytes(StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < 8; ++i) {
                    sb.append(String.format("%02x", h[i]));
                }
                servidor = sb.toString();
            }
            catch (Exception ex) {
                return null;
            }
        }
        return servidor;
    }

    private static String recibir(String pase) {
        Modo nuevo;
        long dura;
        long emitido;
        byte[] texto;
        if (clave == null) {
            return "clave";
        }
        int punto = pase.indexOf(46);
        if (punto <= 0 || punto != pase.lastIndexOf(46)) {
            return "formato";
        }
        try {
            texto = Base64.getUrlDecoder().decode(pase.substring(0, punto));
            byte[] firma = Base64.getUrlDecoder().decode(pase.substring(punto + 1));
            Signature s = Signature.getInstance("Ed25519");
            s.initVerify(clave);
            s.update(texto);
            if (!s.verify(firma)) {
                return "firma";
            }
        }
        catch (Exception ex) {
            return "firma";
        }
        String[] c = new String(texto, StandardCharsets.UTF_8).split("\\|");
        if (c.length != 6 || !PREFIJO.equals(c[0])) {
            return "formato";
        }
        try {
            emitido = Long.parseLong(c[2]);
            dura = Long.parseLong(c[3]);
            nuevo = Modo.valueOf(c[4].toUpperCase(Locale.ROOT));
        }
        catch (RuntimeException ex) {
            return "formato";
        }
        if (dura < 60L || dura > 86400L) {
            return "formato";
        }
        if (!c[1].equals(Pase.servidor())) {
            return "servidor";
        }
        if (emitido <= ultimoEmitido) {
            return "repetido";
        }
        ultimoEmitido = emitido;
        if (!hayPase || nuevo != modo) {
            plugin.getLogger().info("Pase de MineLive recibido (modo " + c[4] + ").");
        }
        hayPase = true;
        modo = nuevo;
        caducaNanos = System.nanoTime() + dura * 1000000000L;
        avisado = false;
        return null;
    }

    private static void atender(ServerCommandEvent e) {
        String orden = e.getCommand().trim();
        if (orden.startsWith("/")) {
            orden = orden.substring(1);
        }
        if (!orden.equals(ORDEN) && !orden.startsWith("mlpase ")) {
            return;
        }
        e.setCancelled(true);
        if (plugin == null) {
            return;
        }
        String resto = orden.substring(ORDEN.length()).trim();
        String nombre = plugin.getName();
        CommandSender quien = e.getSender();
        if (resto.isEmpty() || resto.equals("id")) {
            quien.sendMessage("mlpase:id:" + Pase.servidor() + ":" + nombre + ":" + sinPase);
        } else if (resto.equals("estado")) {
            long quedan = hayPase ? Math.max(0L, (caducaNanos - System.nanoTime()) / 1000000000L) : 0L;
            quien.sendMessage("mlpase:estado:" + nombre + ":" + (quedan > 0L ? "si" : "no") + ":" + modo.name().toLowerCase(Locale.ROOT) + ":" + quedan);
        } else {
            String motivo = Pase.recibir(resto);
            if (motivo == null) {
                sinPase = 0;
                quien.sendMessage("mlpase:ok:" + nombre + ":" + modo.name().toLowerCase(Locale.ROOT));
            } else {
                quien.sendMessage("mlpase:no:" + nombre + ":" + motivo);
            }
        }
    }

    @EventHandler(priority=EventPriority.LOWEST)
    public void alOrdenDeConsola(ServerCommandEvent e) {
        Pase.atender(e);
    }

    @EventHandler(priority=EventPriority.LOWEST)
    public void alOrdenDeRcon(RemoteServerCommandEvent e) {
        Pase.atender((ServerCommandEvent)e);
    }

    private Pase() {
    }

    static {
        modo = DE_FABRICA = Modo.AVISO;
    }

    static enum Modo {
        APAGADO,
        AVISO,
        ESTRICTO;

    }
}

