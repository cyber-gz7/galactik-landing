package com.minelive.atomica;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.title.Title;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.util.Vector;

public final class AtomicaShow {
    private static final int TICK_EXPLOSION = 80;
    private static final int TICK_FIN = 175;
    private static final double TALLO_H = 26.0;
    private static final double SOMBRERO_R = 16.0;
    private static final int RADIO_BOOM_DEFECTO = 22;
    private static final int RADIO_BOOM_MIN = 4;
    private static final int RADIO_BOOM_MAX = 26;
    private static final int PASO_BOOM = 5;
    private static final float POTENCIA_DEFECTO = 8.0f;
    private static final float POTENCIA_MIN = 0.0f;
    private static final float POTENCIA_MAX = 10.0f;
    private static final int BOOMS_POR_TICK = 2;
    private static final String DEF_TITULO = "&6&l[ATÓMICA]";
    private static final String DEF_SUBTITULO = "&c&oHongo nuclear";
    private static final String DEF_CHAT = "&6{donador} lanzó Bomba atómica → {jugador}";

    private final JavaPlugin plugin;
    private final AtomicBoolean activo = new AtomicBoolean(false);
    private final AtomicInteger reloj = new AtomicInteger(0);
    private final List<BukkitTask> tareas = new ArrayList<>();
    private final Deque<Location> colaBooms = new ArrayDeque<>();
    private Location centro;
    private UUID victima;
    private float potencia = 8.0f;
    private int radioBoom = 22;
    private Runnable alTerminar;

    public AtomicaShow(JavaPlugin plugin, Runnable alTerminar) {
        this.plugin = plugin;
        this.alTerminar = alTerminar;
    }

    public boolean lanzar(Player jugador, Opciones o) {
        QuitaTotems.alLanzar(this, jugador, o.entero("totems", 0, 0, 120));
        if (!this.activo.compareAndSet(false, true)) {
            this.plugin.getLogger().info("atomica ignorada (ya hay un show activo)");
            return false;
        }
        this.reloj.set(0);
        this.colaBooms.clear();
        this.victima = jugador.getUniqueId();
        this.centro = jugador.getLocation().clone();
        this.potencia = (float) o.numero("potencia", 8.0, 0.0, 10.0);
        this.radioBoom = o.entero("radio", 22, 4, 26);

        Title titulo = Title.title(
                o.componente(o.texto("titulo", DEF_TITULO), jugador.getName()),
                o.componente(o.texto("subtitulo", DEF_SUBTITULO), jugador.getName()),
                Title.Times.times(Duration.ofMillis(100L), Duration.ofSeconds(4L), Duration.ofMillis(250L))
        );
        jugador.showTitle(titulo);

        String chat = o.texto("chat", DEF_CHAT);
        if (!chat.isEmpty()) {
            Bukkit.broadcast(o.componente(chat, jugador.getName()));
        }

        World mundo = this.centro.getWorld();
        if (mundo != null) {
            mundo.spawnParticle(Particle.FLASH, this.centro.clone().add(0.0, 1.0, 0.0), 2);
            mundo.spawnParticle(Particle.EXPLOSION_HUGE, this.centro, 2, 0.4, 0.2, 0.4, 0.0);
        }

        this.mirarHongo(jugador);
        this.registrar(this.plugin.getServer().getScheduler().runTaskTimer(this.plugin, this::paso, 1L, 1L));
        return true;
    }

    private void mirarHongo(Player jugador) {
        Location aqui = jugador.getLocation().clone();
        AtomicaShow.mirarHacia(aqui, aqui.clone().add(0.0, 18.0, 0.0));
        jugador.teleport(aqui);
    }

    private static void mirarHacia(Location cam, Location target) {
        Vector dir = target.toVector().subtract(cam.toVector());
        double dx = dir.getX();
        double dy = dir.getY();
        double dz = dir.getZ();
        double horiz = Math.sqrt(dx * dx + dz * dz);
        cam.setYaw((float) Math.toDegrees(Math.atan2(-dx, dz)));
        cam.setPitch((float) Math.toDegrees(-Math.atan2(dy, Math.max(0.001, horiz))));
    }

    private void paso() {
        int t = this.reloj.getAndIncrement();
        if (this.centro == null || this.centro.getWorld() == null) {
            this.apagar();
            return;
        }
        Player jugador = this.victima == null ? null : Bukkit.getPlayer(this.victima);
        if (jugador == null || !jugador.isOnline()) {
            this.plugin.getLogger().warning("atomica: el jugador ya no está online");
            this.apagar();
            return;
        }

        if (t % 2 == 0) {
            this.pintarHongo(t);
        }

        if (t == 10 || t == 30) {
            this.mirarHongo(jugador);
        }
        if (t == 80) {
            this.encolarBooms();
        }
        if (t >= 80) {
            this.explotarLote();
        }
        if (t >= 175) {
            this.apagar();
        }
    }

    private void pintarHongo(int t) {
        World mundo = this.centro.getWorld();
        if (mundo == null) {
            return;
        }

        double growTallo = Math.min(1.0, (double) t / 36.0);
        double tallo = 4.0 + 22.0 * growTallo;

        int capas = Math.max(6, (int) (tallo / 2.5));
        for (int i = 0; i <= capas; ++i) {
            double u = (double) i / (double) capas;
            double y = tallo * u;
            double r = 4.0 + 2.0 * u * u;
            Location eje = this.centro.clone().add(0.0, y, 0.0);

            mundo.spawnParticle(Particle.CLOUD, eje, 6, r * 0.4, 0.4, r * 0.4, 0.01);
            mundo.spawnParticle(Particle.SMOKE_LARGE, eje, 4, r * 0.35, 0.3, r * 0.35, 0.01);
            mundo.spawnParticle(Particle.CAMPFIRE_COSY_SMOKE, eje, 3, r * 0.3, 0.25, r * 0.3, 0.01);

            this.anillo(mundo, y, r, 8, Particle.CAMPFIRE_SIGNAL_SMOKE, Particle.SMOKE_LARGE);
        }

        mundo.spawnParticle(Particle.FLAME, this.centro.clone().add(0.0, 0.6, 0.0), 6, 1.2, 0.4, 1.2, 0.02);
        mundo.spawnParticle(Particle.LAVA, this.centro.clone().add(0.0, 0.3, 0.0), 3, 1.0, 0.2, 1.0, 0.0);
        mundo.spawnParticle(Particle.EXPLOSION_LARGE, this.centro.clone().add(0.0, 1.2, 0.0), 1, 0.5, 0.2, 0.5, 0.0);

        if (t < 20) {
            return;
        }

        double growCap = Math.min(1.0, (double) (t - 20) / 42.0);
        double capY = tallo + 0.8;
        double capR = 15.0 * growCap;

        this.disco(mundo, capY, capR, 2, Particle.CAMPFIRE_SIGNAL_SMOKE, Particle.CLOUD);
        this.anillo(mundo, capY, capR * 1.05, 14, Particle.SMOKE_LARGE, Particle.CAMPFIRE_COSY_SMOKE);

        for (int k = 1; k <= 3; ++k) {
            double dy = (double) k * 1.3;
            double dome = capR * Math.sqrt(Math.max(0.0, 1.0 - (dy / 4.8) * (dy / 4.8)));
            this.anillo(mundo, capY + dy, dome, 10, Particle.CLOUD, Particle.CAMPFIRE_SIGNAL_SMOKE);
        }

        for (int k = 1; k <= 2; ++k) {
            double dy = (double) k * 1.2;
            double falda = capR * (1.02 - 0.08 * (double) k);
            this.anillo(mundo, capY - dy, falda, 12, Particle.SMOKE_LARGE, Particle.ASH);
        }

        if (t % 8 == 0) {
            mundo.spawnParticle(Particle.FLASH, this.centro.clone().add(0.0, capY + 1.5, 0.0), 1);
        }
    }

    private void disco(World mundo, double y, double radio, int anillos, Particle a, Particle b) {
        if (radio < 0.5) {
            return;
        }
        for (int k = 1; k <= anillos; ++k) {
            double r = radio * ((double) k / (double) anillos);
            int pts = Math.max(6, (int) (r * 1.2));
            this.anillo(mundo, y, r, pts, a, b);
        }
    }

    private void anillo(World mundo, double y, double radio, int puntos, Particle a, Particle b) {
        if (radio < 0.2) return;
        for (int i = 0; i < puntos; ++i) {
            double ang = Math.PI * 2 * (double) i / (double) puntos;
            Location p = this.centro.clone().add(Math.cos(ang) * radio, y, Math.sin(ang) * radio);
            mundo.spawnParticle(a, p, 1, 0.2, 0.2, 0.2, 0.0);
            if (i % 2 == 0) {
                mundo.spawnParticle(b, p, 1, 0.15, 0.15, 0.15, 0.0);
            }
        }
    }

    private void encolarBooms() {
        int r2 = this.radioBoom * this.radioBoom;
        for (int dx = -this.radioBoom; dx <= this.radioBoom; dx += 5) {
            for (int dy = -this.radioBoom / 2; dy <= this.radioBoom / 3; dy += 5) {
                for (int dz = -this.radioBoom; dz <= this.radioBoom; dz += 5) {
                    if (dx * dx + dy * dy + dz * dz > r2) continue;
                    Location p = this.centro.clone().add((double) dx, (double) dy, (double) dz);
                    if (AtomicaShow.esProtegido(p.getBlock().getType())) continue;
                    this.colaBooms.add(p);
                }
            }
        }
    }

    private void explotarLote() {
        World mundo = this.centro.getWorld();
        if (mundo == null) {
            return;
        }
        int n = 0;
        while (n < 2 && !this.colaBooms.isEmpty()) {
            Location p = this.colaBooms.poll();
            if (p == null || p.getWorld() == null) continue;
            if (p.getBlock().getType() == Material.TNT) {
                p.getBlock().setType(Material.AIR, false);
            }
            if (AtomicaShow.esProtegido(p.getBlock().getType())) continue;
            mundo.createExplosion(p, this.potencia, true, true);
            ++n;
        }
    }

    private static boolean esProtegido(Material tipo) {
        return tipo == Material.BEDROCK || tipo == Material.COMMAND_BLOCK || tipo == Material.CHAIN_COMMAND_BLOCK || tipo == Material.REPEATING_COMMAND_BLOCK || tipo == Material.STRUCTURE_BLOCK || tipo == Material.BARRIER;
    }

    public void apagar() {
        QuitaTotems.alApagar(this.plugin, this);
        for (BukkitTask t : new ArrayList<>(this.tareas)) {
            t.cancel();
        }
        this.tareas.clear();
        this.colaBooms.clear();
        this.victima = null;
        this.centro = null;
        this.reloj.set(0);
        this.activo.set(false);
        Runnable fin = this.alTerminar;
        this.alTerminar = null;
        if (fin != null) {
            fin.run();
        }
    }

    private void registrar(BukkitTask tarea) {
        this.tareas.add(tarea);
    }
}
