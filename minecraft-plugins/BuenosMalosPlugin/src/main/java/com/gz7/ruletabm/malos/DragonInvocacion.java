package com.gz7.ruletabm.malos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.entity.Creature;
import org.bukkit.entity.Entity;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.joml.Vector3f;

public class DragonInvocacion implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().removeTotems(5, "Invocación de Dragón (" + donador + ")");

        Location origin = target.getLocation();
        target.sendMessage(ChatColor.DARK_PURPLE + "" + ChatColor.BOLD + "[MALOS] "
                + ChatColor.DARK_RED + donador + ChatColor.LIGHT_PURPLE + " invocó el Aliento del Dragón (-5 Tótems).");

        AnimationUtils.playGlobalEffectSound(origin, Sound.ENTITY_ENDER_DRAGON_GROWL, 2.0f, 0.8f);

        ItemDisplay dragonHeadDisplay = AnimationUtils.spawnItemDisplay(
                origin.clone().add(0, 3.5, 0),
                new ItemStack(Material.DRAGON_HEAD),
                new Vector3f(2.5f, 2.5f, 2.5f)
        );

        for (Entity nearby : target.getNearbyEntities(15.0, 8.0, 15.0)) {
            if (nearby instanceof Creature creature) {
                creature.setTarget(target);
                creature.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 200, 1));
                creature.addPotionEffect(new PotionEffect(PotionEffectType.INCREASE_DAMAGE, 200, 1));
            }
        }

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || ticks >= 60) {
                    if (dragonHeadDisplay != null && dragonHeadDisplay.isValid()) {
                        dragonHeadDisplay.remove();
                    }
                    cancel();
                    return;
                }

                Location center = target.getLocation().add(0, 1.0, 0);
                center.getWorld().spawnParticle(Particle.DRAGON_BREATH, center, 35, 1.5, 0.8, 1.5, 0.08);
                AnimationUtils.spawnHelix(target.getLocation(), 2.5, 4.0, Particle.PORTAL, 2, 25);

                if (ticks % 15 == 0) {
                    AnimationUtils.playGlobalEffectSound(center, Sound.ENTITY_ENDER_DRAGON_FLAP, 1.2f, 1.0f);
                }

                ticks += 5;
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
