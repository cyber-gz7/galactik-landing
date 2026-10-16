package com.gz7.ruletabm.buenos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;

import java.util.concurrent.ThreadLocalRandom;

public class HackaiSagrado implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().addTotems(3, "Lluvia Sagrada Hackai (" + donador + ")");

        target.sendMessage(ChatColor.AQUA + "" + ChatColor.BOLD + "[BUENOS] "
                + ChatColor.GOLD + donador + ChatColor.YELLOW + " derramó la Lluvia Sagrada (+3 Tótems).");

        target.addPotionEffect(new PotionEffect(PotionEffectType.REGENERATION, 200, 1));
        target.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 160, 0));

        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.BLOCK_BEACON_ACTIVATE, 1.3f, 1.2f);

        new BukkitRunnable() {
            int wave = 0;

            @Override
            public void run() {
                if (!target.isOnline() || wave >= 8) {
                    cancel();
                    return;
                }

                Location base = target.getLocation();
                World world = base.getWorld();
                if (world == null) {
                    cancel();
                    return;
                }

                for (int i = 0; i < 6; i++) {
                    double ox = ThreadLocalRandom.current().nextDouble(-3.0, 3.0);
                    double oz = ThreadLocalRandom.current().nextDouble(-3.0, 3.0);
                    Location dropLoc = base.clone().add(ox, 5.0, oz);
                    world.spawnParticle(Particle.END_ROD, dropLoc, 3, 0.1, -0.4, 0.1, 0.05);
                }

                AnimationUtils.spawnParticleRing(base, 2.0, Particle.TOTEM, 16, 0.2);

                if (wave % 2 == 0) {
                    AnimationUtils.playGlobalEffectSound(base, Sound.BLOCK_ENCHANTMENT_TABLE_USE, 0.8f, 1.6f);
                }

                wave++;
            }
        }.runTaskTimer(plugin, 0L, 8L);
    }
}
