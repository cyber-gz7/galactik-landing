/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  net.kyori.adventure.text.Component
 *  net.kyori.adventure.text.format.NamedTextColor
 *  net.kyori.adventure.text.format.TextColor
 *  net.kyori.adventure.text.format.TextDecoration
 *  org.bukkit.Bukkit
 *  org.bukkit.GameMode
 *  org.bukkit.Sound
 *  org.bukkit.entity.Player
 *  org.bukkit.plugin.Plugin
 *  org.bukkit.plugin.java.JavaPlugin
 *  org.bukkit.scheduler.BukkitTask
 */
package com.minelive.atomica;

import java.util.Map;
import java.util.UUID;
import java.util.WeakHashMap;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.Bukkit;
import org.bukkit.GameMode;
import org.bukkit.Sound;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitTask;

final class QuitaTotems {
    private static final double DANO_MORTAL = 2000.0;
    private static final int TICKS_MINIMOS = 10;
    private static final Map<Object, Pendiente> PENDIENTES = new WeakHashMap<Object, Pendiente>();

    private QuitaTotems() {
    }

    static void alLanzar(Object show, Player jugador, int cuantos) {
        if (cuantos <= 0) {
            return;
        }
        Pendiente antes = PENDIENTES.get(show);
        int total = antes != null && antes.jugador().equals(jugador.getUniqueId()) ? antes.cuantos() + cuantos : cuantos;
        PENDIENTES.put(show, new Pendiente(jugador.getUniqueId(), Math.min(total, 2304), Bukkit.getCurrentTick()));
    }

    static void alApagar(JavaPlugin plugin, Object show) {
        Pendiente p = PENDIENTES.get(show);
        if (p == null || Bukkit.getCurrentTick() - p.desde() < 10) {
            return;
        }
        PENDIENTES.remove(show);
        if (!plugin.isEnabled()) {
            return;
        }
        QuitaTotems.quitar(plugin, p.jugador(), p.cuantos());
    }

    static void ahora(JavaPlugin plugin, Player jugador, int cuantos) {
        if (cuantos > 0 && plugin.isEnabled() && jugador.isOnline()) {
            QuitaTotems.quitar(plugin, jugador.getUniqueId(), cuantos);
        }
    }

    private static void quitar(JavaPlugin plugin, UUID id, int total) {
        BukkitTask[] golpes = new BukkitTask[1];
        long cada = total <= 15 ? 2L : 1L;
        int[] dados = new int[]{0};
        golpes[0] = plugin.getServer().getScheduler().runTaskTimer((Plugin)plugin, () -> {
            GameMode modo;
            Player p = Bukkit.getPlayer((UUID)id);
            GameMode gameMode = modo = p == null ? null : p.getGameMode();
            if (p == null || !p.isOnline() || p.isDead() || dados[0] >= total || modo == GameMode.CREATIVE || modo == GameMode.SPECTATOR) {
                if (golpes[0] != null) {
                    golpes[0].cancel();
                }
                return;
            }
            dados[0] = dados[0] + 1;
            p.setNoDamageTicks(0);
            p.damage(2000.0);
            p.getWorld().playSound(p.getLocation(), Sound.BLOCK_ANVIL_LAND, 0.8f, 0.6f + 0.03f * (float)(dados[0] % 30));
            if (!p.isDead()) {
                p.sendActionBar(Component.text((String)"T\u00d3TEMS ", (TextColor)NamedTextColor.GOLD, (TextDecoration[])new TextDecoration[]{TextDecoration.BOLD}).append((Component)Component.text((String)("-" + dados[0] + " / " + total), (TextColor)NamedTextColor.YELLOW, (TextDecoration[])new TextDecoration[]{TextDecoration.BOLD})));
            }
        }, 6L, cada);
    }

    private record Pendiente(UUID jugador, int cuantos, int desde) {
    }
}

