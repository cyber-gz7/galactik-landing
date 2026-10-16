package com.gz7.ruletabm.buenos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

public class RosaLuz implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        target.sendMessage(ChatColor.AQUA + "" + ChatColor.BOLD + "[BUENOS] "
                + ChatColor.YELLOW + donador + ChatColor.WHITE + " envió Escudo de Luz (Rosa de Luz).");

        target.sendTitle(ChatColor.YELLOW + "✧ Escudo de Luz ✧", ChatColor.GRAY + "Donador: " + donador, 5, 25, 10);
        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.BLOCK_AMETHYST_BLOCK_CHIME, 1.2f, 1.4f);

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || ticks > 30) {
                    cancel();
                    return;
                }

                Location loc = target.getLocation().clone().add(0, 1.0, 0);
                AnimationUtils.spawnParticleRing(loc, 1.2, Particle.TOTEM, 18, 0.0);
                loc.getWorld().spawnParticle(Particle.GLOW, loc, 8, 0.4, 0.4, 0.4, 0.02);

                if (ticks == 10) {
                    AnimationUtils.playGlobalEffectSound(loc, Sound.BLOCK_AMETHYST_CLUSTER_STEP, 1.0f, 1.6f);
                }
                ticks += 5;
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
