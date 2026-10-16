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

public class GGMaldicion implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().removeTotems(1, "Maldición GG (" + donador + ")");

        target.sendMessage(ChatColor.DARK_RED + "" + ChatColor.BOLD + "[MALOS] "
                + ChatColor.RED + donador + ChatColor.GRAY + " activó Maldición del Desastre (-1 Tótem).");

        target.addPotionEffect(new PotionEffect(PotionEffectType.BLINDNESS, 100, 1));
        target.addPotionEffect(new PotionEffect(PotionEffectType.WITHER, 60, 1));

        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.ENTITY_WITHER_AMBIENT, 1.2f, 0.8f);

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || ticks > 40) {
                    cancel();
                    return;
                }

                Location loc = target.getLocation().clone().add(0, 1.2, 0);
                AnimationUtils.spawnParticleRing(loc, 1.2, Particle.SOUL_FIRE_FLAME, 16, 0.0);
                loc.getWorld().spawnParticle(Particle.DAMAGE_INDICATOR, loc, 4, 0.3, 0.3, 0.3, 0.1);
                ticks += 8;
            }
        }.runTaskTimer(plugin, 0L, 8L);
    }
}
