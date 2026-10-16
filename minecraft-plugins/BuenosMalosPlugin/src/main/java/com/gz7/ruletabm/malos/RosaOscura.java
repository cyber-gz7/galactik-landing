package com.gz7.ruletabm.malos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

public class RosaOscura implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        target.sendMessage(ChatColor.DARK_PURPLE + "" + ChatColor.BOLD + "[MALOS] "
                + ChatColor.LIGHT_PURPLE + donador + ChatColor.GRAY + " envió Rosa Oscura (Niebla Sombría).");

        target.sendTitle(ChatColor.DARK_RED + "☠ Rosa Oscura ☠", ChatColor.GRAY + "Donador: " + donador, 5, 25, 10);
        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.ENTITY_ENDERMAN_SCREAM, 1.0f, 0.5f);

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || ticks > 30) {
                    cancel();
                    return;
                }

                Location loc = target.getLocation().clone().add(0, 1.0, 0);
                loc.getWorld().spawnParticle(Particle.SQUID_INK, loc, 15, 0.4, 0.5, 0.4, 0.05);
                loc.getWorld().spawnParticle(Particle.SMOKE_LARGE, loc, 10, 0.5, 0.5, 0.5, 0.02);

                if (ticks == 10) {
                    AnimationUtils.playGlobalEffectSound(loc, Sound.AMBIENT_CAVE, 1.2f, 0.7f);
                }
                ticks += 5;
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
