package com.gz7.ruletabm.buenos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.World;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

public class CarruselTotems implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        main.getTotemManager().addTotems(5, "Tótem Masivo (" + donador + ")");

        Location targetLoc = target.getLocation();
        World world = targetLoc.getWorld();
        if (world == null) return;

        target.sendMessage(ChatColor.GOLD + "" + ChatColor.BOLD + "[BUENOS] "
                + ChatColor.YELLOW + donador + ChatColor.GREEN + " desplegó un Tótem Masivo (+5 Tótems).");

        target.addPotionEffect(new PotionEffect(PotionEffectType.ABSORPTION, 300, 1));
        target.addPotionEffect(new PotionEffect(PotionEffectType.DAMAGE_RESISTANCE, 200, 0));

        ItemDisplay totemDisplay = AnimationUtils.spawnItemDisplay(
                targetLoc.clone().add(0, 1.2, 0),
                new ItemStack(Material.TOTEM_OF_UNDYING),
                new Vector3f(1.8f, 1.8f, 1.8f)
        );

        AnimationUtils.playGlobalEffectSound(targetLoc, Sound.ITEM_TOTEM_USE, 1.5f, 1.0f);

        new BukkitRunnable() {
            int ticks = 0;
            double yOffset = 1.2;

            @Override
            public void run() {
                if (!target.isOnline() || totemDisplay == null || !totemDisplay.isValid() || ticks > 50) {
                    if (totemDisplay != null && totemDisplay.isValid()) {
                        totemDisplay.remove();
                    }
                    cancel();
                    return;
                }

                yOffset += 0.05;
                Location newLoc = target.getLocation().clone().add(0, yOffset, 0);
                totemDisplay.teleport(newLoc);

                float rotAngle = (float) Math.toRadians((ticks * 20.0) % 360.0);
                AnimationUtils.updateDisplayTransform(
                        totemDisplay,
                        null,
                        new AxisAngle4f(rotAngle, 0f, 1f, 0f),
                        new Vector3f(1.8f, 1.8f, 1.8f)
                );

                world.spawnParticle(Particle.TOTEM, newLoc, 15, 0.4, 0.4, 0.4, 0.1);
                AnimationUtils.spawnParticleRing(newLoc, 1.5, Particle.END_ROD, 12, 0.0);

                ticks += 2;
            }
        }.runTaskTimer(plugin, 0L, 2L);
    }
}
