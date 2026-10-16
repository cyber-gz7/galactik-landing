package com.gz7.ruletabm.malos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;

public class CarruselInfierno implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().removeTotems(2, "Carrusel del Infierno (" + donador + ")");

        target.sendMessage(ChatColor.DARK_RED + "" + ChatColor.BOLD + "[MALOS] "
                + ChatColor.GOLD + donador + ChatColor.RED + " activó El Carrusel del Infierno (-2 Tótems).");

        target.addPotionEffect(new PotionEffect(PotionEffectType.CONFUSION, 160, 2));
        target.addPotionEffect(new PotionEffect(PotionEffectType.SLOW, 100, 3));

        new BukkitRunnable() {
            int step = 0;
            float currentYaw = target.getLocation().getYaw();

            @Override
            public void run() {
                if (!target.isOnline() || step >= 40) {
                    cancel();
                    return;
                }

                currentYaw = (currentYaw + 36.0f) % 360.0f;
                Location loc = target.getLocation();
                loc.setYaw(currentYaw);
                target.teleport(loc);

                double radius = 1.8;
                double angle = Math.toRadians(step * 18.0);
                double x = loc.getX() + (radius * Math.cos(angle));
                double z = loc.getZ() + (radius * Math.sin(angle));

                loc.getWorld().spawnParticle(Particle.FLAME, x, loc.getY() + 0.5, z, 5, 0.05, 0.1, 0.05, 0.01);
                loc.getWorld().spawnParticle(Particle.LAVA, x, loc.getY() + 1.2, z, 2, 0, 0, 0, 0);

                if (step % 5 == 0) {
                    AnimationUtils.playGlobalEffectSound(loc, Sound.BLOCK_RESPAWN_ANCHOR_DEPLETE, 0.7f, 1.4f);
                }

                step++;
            }
        }.runTaskTimer(plugin, 0L, 2L);
    }
}
