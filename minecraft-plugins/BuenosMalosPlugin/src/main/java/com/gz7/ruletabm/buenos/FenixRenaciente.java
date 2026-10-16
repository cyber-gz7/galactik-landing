package com.gz7.ruletabm.buenos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.attribute.Attribute;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

public class FenixRenaciente implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().addTotems(8, "Fénix Renaciente (" + donador + ")");

        Location targetLoc = target.getLocation();
        target.sendMessage(ChatColor.GOLD + "" + ChatColor.BOLD + "[BUENOS] "
                + ChatColor.YELLOW + donador + ChatColor.GOLD + " invocó el Fénix Renaciente (+8 Tótems, Cura Completa).");

        for (PotionEffect effect : target.getActivePotionEffects()) {
            target.removePotionEffect(effect.getType());
        }

        double maxHealth = target.getAttribute(Attribute.GENERIC_MAX_HEALTH) != null
                ? target.getAttribute(Attribute.GENERIC_MAX_HEALTH).getValue()
                : 20.0;
        target.setHealth(maxHealth);
        target.setFireTicks(0);

        ItemDisplay fenixCore = AnimationUtils.spawnItemDisplay(
                targetLoc.clone().add(0, 2.5, 0),
                new ItemStack(Material.BLAZE_POWDER),
                new Vector3f(2.0f, 2.0f, 2.0f)
        );

        AnimationUtils.playGlobalEffectSound(targetLoc, Sound.ITEM_TOTEM_USE, 1.5f, 1.3f);
        AnimationUtils.playGlobalEffectSound(targetLoc, Sound.ENTITY_ENDER_DRAGON_FLAP, 1.2f, 1.5f);

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || fenixCore == null || !fenixCore.isValid() || ticks > 50) {
                    if (fenixCore != null && fenixCore.isValid()) {
                        fenixCore.remove();
                    }
                    cancel();
                    return;
                }

                Location current = target.getLocation().clone().add(0, 1.5, 0);
                fenixCore.teleport(current.clone().add(0, 1.0, 0));

                AnimationUtils.updateDisplayTransform(
                        fenixCore,
                        null,
                        new AxisAngle4f((float) Math.toRadians(ticks * 25.0), 0f, 1f, 0f),
                        new Vector3f(2.2f, 2.2f, 2.2f)
                );

                AnimationUtils.spawnHelix(target.getLocation(), 2.0, 3.5, Particle.FLAME, 3, 30);
                current.getWorld().spawnParticle(Particle.HEART, current, 4, 0.5, 0.5, 0.5, 0.1);

                ticks += 5;
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
