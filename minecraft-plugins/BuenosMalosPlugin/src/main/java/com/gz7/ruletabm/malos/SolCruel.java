package com.gz7.ruletabm.malos;

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
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

import java.util.concurrent.ThreadLocalRandom;

public class SolCruel implements GiftHandler {

    @Override
    public void execute(Player target, String donador, JavaPlugin plugin) {
        BuenosMalosMain main = (BuenosMalosMain) plugin;
        Location targetLoc = target.getLocation();
        World world = targetLoc.getWorld();
        if (world == null) return;

        target.sendMessage(ChatColor.GOLD + "" + ChatColor.BOLD + "☀☠ ¡¡SOL CRUEL DESATADO POR "
                + ChatColor.RED + donador.toUpperCase() + ChatColor.GOLD + "!! ☠☀");

        target.sendTitle(
                ChatColor.GOLD + "☀ SOL CRUEL ☀",
                ChatColor.RED + "Mega Instakill enviado por " + donador,
                10, 80, 20
        );

        Location sunLoc = targetLoc.clone().add(0, 10.0, 0);
        BlockDisplay sunDisplay = AnimationUtils.spawnBlockDisplay(
                sunLoc,
                Material.MAGMA_BLOCK,
                new Vector3f(1.5f, 1.5f, 1.5f)
        );

        target.addPotionEffect(new PotionEffect(PotionEffectType.SLOW, 120, 255, false, false));
        target.addPotionEffect(new PotionEffect(PotionEffectType.GLOWING, 120, 1, false, false));

        new BukkitRunnable() {
            int ticks = 0;
            float scale = 1.5f;

            @Override
            public void run() {
                if (!target.isOnline() || sunDisplay == null || !sunDisplay.isValid()) {
                    cleanup();
                    cancel();
                    return;
                }

                Location currentSun = sunDisplay.getLocation();

                if (ticks < 50) {
                    // Fase 1: Formación y expansión del sol infernal
                    scale += 0.08f;
                    AnimationUtils.updateDisplayTransform(
                            sunDisplay,
                            new Vector3f(-scale / 2f, -scale / 2f, -scale / 2f),
                            new AxisAngle4f((float) Math.toRadians(ticks * 8), 0.5f, 1f, 0.2f),
                            new Vector3f(scale, scale, scale)
                    );

                    AnimationUtils.spawnParticleRing(currentSun, scale * 1.5, Particle.FLAME, 30, 0.0);
                    world.spawnParticle(Particle.LAVA, currentSun, 8, 1.0, 1.0, 1.0, 0.1);

                    if (ticks % 10 == 0) {
                        AnimationUtils.playGlobalEffectSound(currentSun, Sound.BLOCK_FIRE_AMBIENT, 2.0f, 0.8f);
                    }
                } else if (ticks < 90) {
                    // Fase 2: Lluvia ígnea densa e implosión
                    currentSun.subtract(0, 0.15, 0);
                    sunDisplay.teleport(currentSun);

                    for (int i = 0; i < 5; i++) {
                        double ox = ThreadLocalRandom.current().nextDouble(-6.0, 6.0);
                        double oz = ThreadLocalRandom.current().nextDouble(-6.0, 6.0);
                        Location rainPoint = target.getLocation().clone().add(ox, 6.0, oz);
                        world.spawnParticle(Particle.DRIP_LAVA, rainPoint, 6, 0.2, 0.5, 0.2, 0.1);
                        world.spawnParticle(Particle.FLAME, rainPoint, 4, 0.2, 0.5, 0.2, 0.05);
                    }

                    if (ticks % 10 == 0) {
                        AnimationUtils.playGlobalEffectSound(target.getLocation(), Sound.ENTITY_BLAZE_SHOOT, 1.5f, 0.6f);
                    }
                } else if (ticks >= 100) {
                    // Fase 3: Mega explosión solar e impacto (5+ segundos)
                    Location impactLoc = target.getLocation().clone().add(0, 1.0, 0);
                    world.spawnParticle(Particle.EXPLOSION_HUGE, impactLoc, 5, 0.5, 0.5, 0.5, 0.0);
                    world.spawnParticle(Particle.FLASH, impactLoc, 5);
                    world.spawnParticle(Particle.LAVA, impactLoc, 50, 2.0, 2.0, 2.0, 0.2);

                    AnimationUtils.playGlobalEffectSound(impactLoc, Sound.ENTITY_GENERIC_EXPLODE, 3.0f, 0.5f);
                    AnimationUtils.playGlobalEffectSound(impactLoc, Sound.ENTITY_WITHER_DEATH, 2.0f, 0.7f);

                    target.setFireTicks(100);
                    main.getTotemManager().removeTotems(20, "MEGA INSTAKILL Sol Cruel (" + donador + ")");

                    cleanup();
                    cancel();
                    return;
                }

                ticks += 5;
            }

            private void cleanup() {
                if (sunDisplay != null && sunDisplay.isValid()) {
                    sunDisplay.remove();
                }
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }
}
