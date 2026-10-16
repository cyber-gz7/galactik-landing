package com.gz7.ruletabm.buenos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.attribute.Attribute;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;

public class GGBendicion implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().addTotems(1, "Bendición GG (" + donador + ")");

        target.sendMessage(ChatColor.AQUA + "" + ChatColor.BOLD + "[BUENOS] "
                + ChatColor.YELLOW + donador + ChatColor.GREEN + " otorgó Bendición Menor (+1 Tótem).");

        target.removePotionEffect(PotionEffectType.BLINDNESS);
        target.removePotionEffect(PotionEffectType.WITHER);
        target.removePotionEffect(PotionEffectType.POISON);
        target.removePotionEffect(PotionEffectType.CONFUSION);
        target.removePotionEffect(PotionEffectType.SLOW);

        double maxHealth = target.getAttribute(Attribute.GENERIC_MAX_HEALTH) != null
                ? target.getAttribute(Attribute.GENERIC_MAX_HEALTH).getValue()
                : 20.0;
        target.setHealth(Math.min(maxHealth, target.getHealth() + 6.0));

        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.BLOCK_BEACON_POWER_SELECT, 1.2f, 1.5f);

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || ticks > 30) {
                    cancel();
                    return;
                }

                Location loc = target.getLocation().clone().add(0, 1.0, 0);
                loc.getWorld().spawnParticle(Particle.HEART, loc, 3, 0.4, 0.4, 0.4, 0.05);
                AnimationUtils.spawnParticleRing(loc, 1.0, Particle.VILLAGER_HAPPY, 12, 0.0);
                ticks += 6;
            }
        }.runTaskTimer(plugin, 0L, 6L);
    }
}
