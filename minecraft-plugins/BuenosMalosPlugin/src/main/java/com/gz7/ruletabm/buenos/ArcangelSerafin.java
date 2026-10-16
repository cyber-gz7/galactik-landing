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
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.entity.Monster;
import org.bukkit.entity.Player;
import org.bukkit.inventory.EntityEquipment;
import org.bukkit.inventory.ItemStack;
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

public class ArcangelSerafin implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        Location targetLoc = target.getLocation();
        World world = targetLoc.getWorld();
        if (world == null) return;

        target.sendMessage(ChatColor.YELLOW + "" + ChatColor.BOLD + "✧✧ ¡¡ARCÁNGEL SERAFÍN INVOCADO POR "
                + ChatColor.AQUA + donador.toUpperCase() + ChatColor.YELLOW + "!! ✧✧");

        target.sendTitle(
                ChatColor.YELLOW + "✧ ARCÁNGEL SERAFÍN ✧",
                ChatColor.AQUA + "Instasave supremo de " + donador,
                10, 80, 20
        );

        Vector dir = targetLoc.getDirection().setY(0).normalize();
        Location angelLoc = targetLoc.clone().add(dir.multiply(2.5)).add(0, 1.5, 0);
        angelLoc.setDirection(targetLoc.toVector().subtract(angelLoc.toVector()));

        ArmorStand angel = world.spawn(angelLoc, ArmorStand.class, stand -> {
            stand.setVisible(true);
            stand.setGravity(false);
            stand.setBasePlate(false);
            stand.setArms(true);
            stand.setInvulnerable(true);
            stand.setCollidable(false);

            EntityEquipment eq = stand.getEquipment();
            if (eq != null) {
                eq.setHelmet(new ItemStack(Material.GOLDEN_HELMET));
                eq.setChestplate(new ItemStack(Material.ELYTRA));
                eq.setLeggings(new ItemStack(Material.GOLDEN_LEGGINGS));
                eq.setBoots(new ItemStack(Material.GOLDEN_BOOTS));
                eq.setItemInMainHand(new ItemStack(Material.GOLDEN_SWORD));
            }
            stand.setRightArmPose(new EulerAngle(Math.toRadians(290), 0, 0));
        });

        List<ItemDisplay> haloRings = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            ItemDisplay ringPiece = AnimationUtils.spawnItemDisplay(
                    angelLoc.clone().add(0, 2.2, 0),
                    new ItemStack(Material.OCHRE_FROGLIGHT),
                    new Vector3f(0.5f, 0.5f, 0.5f)
            );
            if (ringPiece != null) haloRings.add(ringPiece);
        }

        target.addPotionEffect(new PotionEffect(PotionEffectType.ABSORPTION, 400, 2, false, false));
        target.addPotionEffect(new PotionEffect(PotionEffectType.DAMAGE_RESISTANCE, 200, 1, false, false));

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!target.isOnline() || angel == null || !angel.isValid()) {
                    cleanup();
                    cancel();
                    return;
                }

                Location currentAngel = angel.getLocation();

                if (ticks < 40) {
                    // Fase 1: Descenso celestial y canto angelical
                    angel.teleport(currentAngel.clone().subtract(0, 0.02, 0));
                    AnimationUtils.spawnParticleRing(currentAngel, 2.0, Particle.END_ROD, 20, 0.5);
                    world.spawnParticle(Particle.TOTEM, currentAngel.clone().add(0, 1.0, 0), 12, 0.4, 0.4, 0.4, 0.05);

                    if (ticks % 10 == 0) {
                        AnimationUtils.playGlobalEffectSound(currentAngel, Sound.BLOCK_AMETHYST_BLOCK_CHIME, 1.4f, 1.2f);
                    }
                } else if (ticks < 80) {
                    // Fase 2: Anillos de luz en rotación y purificación de área
                    double yawAngle = Math.toRadians((ticks * 15.0) % 360.0);
                    for (int i = 0; i < haloRings.size(); i++) {
                        ItemDisplay piece = haloRings.get(i);
                        double offsetAngle = yawAngle + (i * (Math.PI / 2.0));
                        Location pPos = currentAngel.clone().add(Math.cos(offsetAngle) * 1.6, 2.2 + Math.sin(ticks * 0.1) * 0.2, Math.sin(offsetAngle) * 1.6);
                        piece.teleport(pPos);
                        AnimationUtils.updateDisplayTransform(piece, null, new AxisAngle4f((float) offsetAngle, 0f, 1f, 0f), new Vector3f(0.6f, 0.6f, 0.6f));
                    }

                    AnimationUtils.spawnParticleRingRotated(currentAngel.clone().add(0, 1.2, 0), 2.8, Particle.END_ROD, 24, Math.toRadians(45), Math.toRadians(ticks * 8));

                    if (ticks == 45) {
                        AnimationUtils.playGlobalEffectSound(currentAngel, Sound.BLOCK_BEACON_ACTIVATE, 1.6f, 1.4f);
                    }
                } else if (ticks >= 100) {
                    // Fase 3: Purificación total (5 segundos completados)
                    Location burstLoc = target.getLocation().clone().add(0, 1.0, 0);
                    world.spawnParticle(Particle.FLASH, burstLoc, 5);
                    world.spawnParticle(Particle.TOTEM, burstLoc, 80, 2.0, 2.0, 2.0, 0.2);
                    AnimationUtils.playGlobalEffectSound(burstLoc, Sound.ITEM_TOTEM_USE, 2.0f, 1.0f);
                    AnimationUtils.playGlobalEffectSound(burstLoc, Sound.ENTITY_PLAYER_LEVELUP, 1.5f, 1.2f);

                    world.getNearbyEntities(burstLoc, 16.0, 8.0, 16.0).stream()
                            .filter(e -> e instanceof Monster)
                            .forEach(e -> {
                                ((Monster) e).damage(500.0);
                                world.spawnParticle(Particle.SMOKE_LARGE, e.getLocation(), 10, 0.2, 0.2, 0.2, 0.05);
                            });

                    main.getTotemManager().addTotems(20, "INSTASAVE Arcángel (" + donador + ")");

                    cleanup();
                    cancel();
                    return;
                }

                ticks += 5;
            }

            private void cleanup() {
                if (angel != null && angel.isValid()) {
                    angel.remove();
                }
                for (ItemDisplay piece : haloRings) {
                    if (piece != null && piece.isValid()) {
                        piece.remove();
                    }
                }
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
