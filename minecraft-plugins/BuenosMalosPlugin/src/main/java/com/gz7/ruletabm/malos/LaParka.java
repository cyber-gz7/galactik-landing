package com.gz7.ruletabm.malos;

import com.gz7.ruletabm.AnimationUtils;
import com.gz7.ruletabm.BuenosMalosMain;
import com.gz7.ruletabm.GiftHandler;
import org.bukkit.ChatColor;
import org.bukkit.Color;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.World;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.entity.Player;
import org.bukkit.inventory.EntityEquipment;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.LeatherArmorMeta;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.util.EulerAngle;
import org.bukkit.util.Vector;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

import java.util.ArrayList;
import java.util.List;

public class LaParka implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        Location targetLoc = target.getLocation();
        World world = targetLoc.getWorld();
        if (world == null) return;

        target.sendMessage(ChatColor.DARK_RED + "" + ChatColor.BOLD + "☠☠ LA PARKA HA SIDO ENVIADA POR "
                + ChatColor.GOLD + donador.toUpperCase() + ChatColor.DARK_RED + " ☠☠");

        target.sendTitle(ChatColor.DARK_RED + "☠ LA PARKA ☠", ChatColor.RED + "Instakill enviado por " + donador, 10, 80, 20);

        Vector dir = targetLoc.getDirection().setY(0).normalize();
        Location reaperLoc = targetLoc.clone().add(dir.multiply(2.5));
        reaperLoc.setDirection(targetLoc.toVector().subtract(reaperLoc.toVector()));

        ArmorStand reaper = world.spawn(reaperLoc, ArmorStand.class, stand -> {
            stand.setVisible(true);
            stand.setGravity(false);
            stand.setBasePlate(false);
            stand.setArms(true);
            stand.setInvulnerable(true);
            stand.setCollidable(false);

            EntityEquipment eq = stand.getEquipment();
            if (eq != null) {
                eq.setHelmet(new ItemStack(Material.WITHER_SKELETON_SKULL));
                eq.setChestplate(createDyedLeather(Material.LEATHER_CHESTPLATE, Color.BLACK));
                eq.setLeggings(createDyedLeather(Material.LEATHER_LEGGINGS, Color.BLACK));
                eq.setBoots(createDyedLeather(Material.LEATHER_BOOTS, Color.BLACK));
                eq.setItemInMainHand(new ItemStack(Material.NETHERITE_HOE));
            }
            stand.setRightArmPose(new EulerAngle(Math.toRadians(270), Math.toRadians(45), 0));
        });

        List<ItemDisplay> scytheOrbs = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            ItemDisplay orb = AnimationUtils.spawnItemDisplay(
                    reaperLoc.clone().add(0, 1.5, 0),
                    new ItemStack(Material.SOUL_LANTERN),
                    new Vector3f(0.6f, 0.6f, 0.6f)
            );
            if (orb != null) scytheOrbs.add(orb);
        }

        target.addPotionEffect(new PotionEffect(PotionEffectType.BLINDNESS, 120, 1, false, false));
        target.addPotionEffect(new PotionEffect(PotionEffectType.SLOW, 120, 255, false, false));

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || reaper == null || !reaper.isValid()) {
                    cleanup();
                    cancel();
                    return;
                }

                Location currentReaper = reaper.getLocation();

                if (ticks < 40) {
                    // Fase 1: Ritual y condensación sombría
                    AnimationUtils.spawnParticleRing(currentReaper, 2.5, Particle.SOUL_FIRE_FLAME, 24, 0.1);
                    world.spawnParticle(Particle.SQUID_INK, currentReaper.clone().add(0, 1.2, 0), 10, 0.4, 0.4, 0.4, 0.05);

                    if (ticks % 10 == 0) {
                        AnimationUtils.playGlobalEffectSound(currentReaper, Sound.ENTITY_WARDEN_HEARTBEAT, 1.5f, 0.6f);
                    }
                } else if (ticks < 80) {
                    // Fase 2: Elevación de la guadaña y rotación de orbes
                    double angleStep = (ticks * 10.0) % 360.0;
                    for (int i = 0; i < scytheOrbs.size(); i++) {
                        ItemDisplay orb = scytheOrbs.get(i);
                        double rad = Math.toRadians(angleStep + (i * 120.0));
                        Location orbPos = currentReaper.clone().add(Math.cos(rad) * 1.5, 1.5 + Math.sin(Math.toRadians(ticks * 4)) * 0.4, Math.sin(rad) * 1.5);
                        orb.teleport(orbPos);
                        AnimationUtils.updateDisplayTransform(orb, null, new AxisAngle4f((float) Math.toRadians(ticks * 15), 0f, 1f, 0f), new Vector3f(0.8f, 0.8f, 0.8f));
                    }

                    reaper.teleport(currentReaper.clone().add(0, 0.03, 0));
                    world.spawnParticle(Particle.SMOKE_LARGE, currentReaper.clone().add(0, 1.0, 0), 15, 0.5, 0.5, 0.5, 0.02);

                    if (ticks == 45) {
                        AnimationUtils.playGlobalEffectSound(currentReaper, Sound.ENTITY_WITHER_SPAWN, 1.3f, 0.6f);
                    }
                } else if (ticks >= 100) {
                    // Fase 3: Golpe mortal de La Parka (5 segundos completados)
                    Location strikeLoc = target.getLocation().clone().add(0, 1.0, 0);
                    world.spawnParticle(Particle.SONIC_BOOM, strikeLoc, 1);
                    world.spawnParticle(Particle.FLASH, strikeLoc, 3);
                    world.strikeLightningEffect(strikeLoc);
                    AnimationUtils.playGlobalEffectSound(strikeLoc, Sound.ENTITY_WARDEN_SONIC_BOOM, 2.0f, 0.7f);

                    main.getTotemManager().removeTotems(20, "INSTAKILL La Parka (" + donador + ")");

                    cleanup();
                    cancel();
                    return;
                }

                ticks += 5;
            }

            private void cleanup() {
                if (reaper != null && reaper.isValid()) {
                    reaper.remove();
                }
                for (ItemDisplay orb : scytheOrbs) {
                    if (orb != null && orb.isValid()) {
                        orb.remove();
                    }
                }
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }

    private ItemStack createDyedLeather(Material mat, Color color) {
        ItemStack item = new ItemStack(mat);
        if (item.getItemMeta() instanceof LeatherArmorMeta meta) {
            meta.setColor(color);
            item.setItemMeta(meta);
        }
        return item;
    }
}
