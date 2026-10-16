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
import org.bukkit.entity.BlockDisplay;
import org.bukkit.entity.Monster;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

public class DeidadSolar implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        Location targetLoc = target.getLocation();
        World world = targetLoc.getWorld();
        if (world == null) return;

        target.sendMessage(ChatColor.GOLD + "" + ChatColor.BOLD + "☀✧ ¡¡DEIDAD SOLAR CELESTIAL DESCENDIÓ POR "
                + ChatColor.YELLOW + donador.toUpperCase() + ChatColor.GOLD + "!! ✧☀");

        target.sendTitle(
                ChatColor.GOLD + "☀ DEIDAD SOLAR ☀",
                ChatColor.YELLOW + "Mega Save Celestial de " + donador,
                10, 80, 20
        );

        Location beaconLoc = targetLoc.clone().add(0, 8.0, 0);
        BlockDisplay solarCore = AnimationUtils.spawnBlockDisplay(
                beaconLoc,
                Material.BEACON,
                new Vector3f(2.0f, 2.0f, 2.0f)
        );

        target.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 600, 1, false, false));
        target.addPotionEffect(new PotionEffect(PotionEffectType.REGENERATION, 600, 2, false, false));
        target.addPotionEffect(new PotionEffect(PotionEffectType.ABSORPTION, 600, 4, false, false));

        new BukkitRunnable() {
            int ticks = 0;
            float scale = 2.0f;

            @Override
            public void run() {
                if (!target.isOnline() || solarCore == null || !solarCore.isValid()) {
                    cleanup();
                    cancel();
                    return;
                }

                Location currentCore = solarCore.getLocation();

                if (ticks < 50) {
                    // Fase 1: Radiación solar y expansión del núcleo divino
                    scale += 0.05f;
                    AnimationUtils.updateDisplayTransform(
                            solarCore,
                            new Vector3f(-scale / 2f, -scale / 2f, -scale / 2f),
                            new AxisAngle4f((float) Math.toRadians(ticks * 10), 0f, 1f, 0f),
                            new Vector3f(scale, scale, scale)
                    );

                    AnimationUtils.spawnParticleRing(currentCore, 3.5, Particle.END_ROD, 32, 0.0);
                    AnimationUtils.spawnParticleRing(target.getLocation(), 4.0, Particle.TOTEM, 28, 0.2);

                    if (ticks % 10 == 0) {
                        AnimationUtils.playGlobalEffectSound(currentCore, Sound.BLOCK_BEACON_AMBIENT, 2.0f, 1.3f);
                    }
                } else if (ticks < 90) {
                    // Fase 2: Anillos de luz dimensionales concéntricos y descenso
                    currentCore.subtract(0, 0.1, 0);
                    solarCore.teleport(currentCore);

                    AnimationUtils.spawnParticleRingRotated(currentCore, 4.5, Particle.END_ROD, 36, Math.toRadians(30), Math.toRadians(ticks * 12));
                    AnimationUtils.spawnParticleRingRotated(currentCore, 4.5, Particle.TOTEM, 36, Math.toRadians(-30), Math.toRadians(-ticks * 12));

                    if (ticks % 10 == 0) {
                        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.BLOCK_AMETHYST_BLOCK_RESONATE, 2.0f, 1.5f);
                    }
                } else if (ticks >= 100) {
                    // Fase 3: Detonación de luz sagrada e inmunidad total (5+ segundos)
                    Location burstLoc = target.getLocation().clone().add(0, 1.0, 0);
                    world.spawnParticle(Particle.FLASH, burstLoc, 8);
                    world.spawnParticle(Particle.TOTEM, burstLoc, 120, 3.0, 3.0, 3.0, 0.3);
                    world.spawnParticle(Particle.END_ROD, burstLoc, 80, 2.0, 2.0, 2.0, 0.2);

                    AnimationUtils.playGlobalEffectSound(burstLoc, Sound.BLOCK_BEACON_ACTIVATE, 2.5f, 1.0f);
                    AnimationUtils.playGlobalEffectSound(burstLoc, Sound.ITEM_TOTEM_USE, 2.5f, 0.8f);

                    main.getGameState().setImmunitySeconds(30);
                    main.getTotemManager().addTotems(20, "MEGA SAVE Deidad Solar (" + donador + ")");

                    world.getNearbyEntities(burstLoc, 25.0, 12.0, 25.0).stream()
                            .filter(e -> e instanceof Monster)
                            .forEach(e -> {
                                ((Monster) e).damage(1000.0);
                                world.spawnParticle(Particle.EXPLOSION_LARGE, e.getLocation(), 2);
                            });

                    target.sendMessage(ChatColor.GOLD + "" + ChatColor.BOLD + "¡ESCUDO SAGRADO ACTIVO! Eres inmune al daño por 30 segundos.");

                    cleanup();
                    cancel();
                    return;
                }

                ticks += 5;
            }

            private void cleanup() {
                if (solarCore != null && solarCore.isValid()) {
                    solarCore.remove();
                }
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
