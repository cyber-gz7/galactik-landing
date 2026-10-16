package com.gz7.ruletabm.malos;

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

public class HackaiLluvia implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().removeTotems(3, "Lluvia Ácida Hackai (" + donador + ")");

        target.sendMessage(ChatColor.DARK_RED + "" + ChatColor.BOLD + "[MALOS] "
                + ChatColor.GOLD + donador + ChatColor.RED + " desató Lluvia Ácida (-3 Tótems).");

        target.addPotionEffect(new PotionEffect(PotionEffectType.POISON, 100, 1));
        target.addPotionEffect(new PotionEffect(PotionEffectType.HUNGER, 120, 2));

        new BukkitRunnable() {
            int wave = 0;

            @Override
            public void run() {
                if (!target.isOnline() || wave >= 6) {
                    cancel();
                    return;
                }

                Location base = target.getLocation();
                World world = base.getWorld();
                if (world == null) {
                    cancel();
                    return;
                }

                double offsetX = ThreadLocalRandom.current().nextDouble(-4.0, 4.0);
                double offsetZ = ThreadLocalRandom.current().nextDouble(-4.0, 4.0);
                Location strikeLoc = base.clone().add(offsetX, 0, offsetZ);

                world.strikeLightningEffect(strikeLoc);
                world.spawnParticle(Particle.SLIME, strikeLoc.clone().add(0, 1.5, 0), 30, 1.0, 1.0, 1.0, 0.1);
                world.spawnParticle(Particle.DRIP_LAVA, strikeLoc.clone().add(0, 2.5, 0), 20, 0.8, 0.8, 0.8, 0.1);
                AnimationUtils.playGlobalEffectSound(strikeLoc, Sound.BLOCK_LAVA_EXTINGUISH, 1.2f, 0.6f);

                wave++;
            }
        }.runTaskTimer(plugin, 0L, 12L);
    }
}
