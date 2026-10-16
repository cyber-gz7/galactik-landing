package com.gz7.ruletabm;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.boss.BossBar;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;

public class TotemManager {

    private final JavaPlugin plugin;
    private final GameState gameState;
    private BossBar bossBar;
    private BukkitRunnable hudTask;

    public TotemManager(JavaPlugin plugin, GameState gameState) {
        this.plugin = plugin;
        this.gameState = gameState;
        initializeBossBar();
        startHudUpdater();
    }

    private void initializeBossBar() {
        this.bossBar = Bukkit.createBossBar(
                ChatColor.GOLD + "" + ChatColor.BOLD + "BUENOS vs MALOS " + ChatColor.DARK_GRAY + "» " + ChatColor.YELLOW + "Tótems: 10/20",
                BarColor.YELLOW,
                BarStyle.SEGMENTED_20
        );
        this.bossBar.setVisible(true);
        this.bossBar.setProgress(10.0 / 20.0);
    }

    private void startHudUpdater() {
        this.hudTask = new BukkitRunnable() {
            @Override
            public void run() {
                updateHudDisplays();
            }
        };
        this.hudTask.runTaskTimer(plugin, 0L, 10L);
    }

    public synchronized void updateHudDisplays() {
        int totems = gameState.getCurrentTotems();
        int max = GameState.getMaxTotems();
        double progress = Math.max(0.0, Math.min(1.0, (double) totems / max));

        bossBar.setProgress(progress);

        BarColor barColor;
        if (totems > 12) {
            barColor = BarColor.GREEN;
        } else if (totems > 5) {
            barColor = BarColor.YELLOW;
        } else {
            barColor = BarColor.RED;
        }
        bossBar.setColor(barColor);

        String immunityTag = gameState.isImmune()
                ? ChatColor.AQUA + " [ESCUDO: " + gameState.getRemainingImmunitySeconds() + "s] "
                : " ";

        bossBar.setTitle(ChatColor.GOLD + "" + ChatColor.BOLD + "✦ TÓTEMS: "
                + ChatColor.YELLOW + totems + ChatColor.WHITE + "/" + ChatColor.GOLD + max
                + immunityTag
                + ChatColor.DARK_GRAY + "« "
                + ChatColor.GREEN + ChatColor.BOLD + "BUENOS "
                + ChatColor.GRAY + "vs "
                + ChatColor.RED + ChatColor.BOLD + "MALOS"
                + ChatColor.DARK_GRAY + " »");

        for (Player p : Bukkit.getOnlinePlayers()) {
            if (!bossBar.getPlayers().contains(p)) {
                bossBar.addPlayer(p);
            }

            StringBuilder barVisual = new StringBuilder();
            for (int i = 0; i < max; i++) {
                if (i < totems) {
                    barVisual.append(ChatColor.GOLD).append("■");
                } else {
                    barVisual.append(ChatColor.DARK_GRAY).append("□");
                }
            }

            String actionText = ChatColor.GOLD + "✦ " + barVisual + ChatColor.GOLD + " ✦ "
                    + ChatColor.YELLOW + "[" + totems + "/" + max + "]"
                    + (gameState.isImmune() ? ChatColor.AQUA + " 🛡 INMUNE" : "");

            Component actionComponent = LegacyComponentSerializer.legacySection().deserialize(actionText);
            p.sendActionBar(actionComponent);
        }
    }

    public void addTotems(int count, String triggerReason) {
        int previous = gameState.getCurrentTotems();
        int updated = gameState.addTotems(count);
        updateHudDisplays();

        Player target = gameState.getActivePlayer();
        if (target != null && target.isOnline()) {
            target.playSound(target.getLocation(), Sound.ITEM_TOTEM_USE, 0.7f, 1.2f);
            target.sendTitle(
                    ChatColor.GREEN + "" + ChatColor.BOLD + "+" + (updated - previous) + " TÓTEMS",
                    ChatColor.WHITE + triggerReason,
                    5, 25, 10
            );
        }
    }

    public void removeTotems(int count, String triggerReason) {
        if (gameState.isImmune()) {
            Player target = gameState.getActivePlayer();
            if (target != null && target.isOnline()) {
                target.sendMessage(ChatColor.AQUA + "¡Daño evitado! El jugador posee escudo de inmunidad activo.");
                target.playSound(target.getLocation(), Sound.ITEM_SHIELD_BLOCK, 1.0f, 1.5f);
            }
            return;
        }

        int previous = gameState.getCurrentTotems();
        int updated = gameState.removeTotems(count);
        updateHudDisplays();

        Player target = gameState.getActivePlayer();
        if (target != null && target.isOnline()) {
            target.playSound(target.getLocation(), Sound.ENTITY_WITHER_HURT, 0.8f, 0.8f);
            target.sendTitle(
                    ChatColor.RED + "" + ChatColor.BOLD + "-" + (previous - updated) + " TÓTEMS",
                    ChatColor.DARK_RED + triggerReason,
                    5, 25, 10
            );

            if (updated <= 0 && !gameState.isCinematicLocked()) {
                triggerDramaticDeathSequence(target);
            }
        }
    }

    public void setTotems(int count) {
        gameState.setTotems(count);
        updateHudDisplays();
        Player target = gameState.getActivePlayer();
        if (target != null && target.isOnline()) {
            target.sendMessage(ChatColor.GOLD + "Tótems actualizados a: " + ChatColor.YELLOW + gameState.getCurrentTotems());
        }
    }

    public void triggerDramaticDeathSequence(Player player) {
        if (gameState.isCinematicLocked()) return;
        gameState.setCinematicLock(true);

        Location origin = player.getLocation().clone();
        player.addPotionEffect(new PotionEffect(PotionEffectType.BLINDNESS, 140, 2, false, false));
        player.addPotionEffect(new PotionEffect(PotionEffectType.SLOW, 140, 255, false, false));

        new BukkitRunnable() {
            int ticks = 0;

            @Override
            public void run() {
                if (!player.isOnline()) {
                    gameState.setCinematicLock(false);
                    cancel();
                    return;
                }

                ticks += 5;
                Location current = player.getLocation();

                if (ticks == 5) {
                    player.sendTitle(
                            ChatColor.DARK_RED + "" + ChatColor.BOLD + "¡0 TÓTEMS RESTANTES!",
                            ChatColor.RED + "Las sombras reclaman tu alma...",
                            10, 60, 20
                    );
                    AnimationUtils.playGlobalEffectSound(current, Sound.ENTITY_WITHER_SPAWN, 1.2f, 0.5f);
                }

                if (ticks % 10 == 0) {
                    AnimationUtils.spawnParticleRing(current, 3.0, Particle.SOUL_FIRE_FLAME, 32, 0.2);
                    AnimationUtils.spawnHelix(current, 2.0, 4.0, Particle.SMOKE_LARGE, 2, 20);
                    AnimationUtils.playGlobalEffectSound(current, Sound.ENTITY_WARDEN_HEARTBEAT, 1.5f, 0.8f);
                }

                if (ticks == 60) {
                    AnimationUtils.playGlobalEffectSound(current, Sound.ENTITY_LIGHTNING_BOLT_THUNDER, 2.0f, 0.6f);
                    current.getWorld().strikeLightningEffect(current);
                }

                if (ticks >= 100) {
                    cancel();
                    AnimationUtils.playGlobalEffectSound(current, Sound.ENTITY_GENERIC_EXPLODE, 2.0f, 0.5f);
                    current.getWorld().spawnParticle(Particle.EXPLOSION_HUGE, current.clone().add(0, 1, 0), 3, 0, 0, 0, 0);

                    player.removePotionEffect(PotionEffectType.BLINDNESS);
                    player.removePotionEffect(PotionEffectType.SLOW);
                    gameState.setCinematicLock(false);
                    gameState.setTotems(10);
                    updateHudDisplays();

                    player.setHealth(0.0);
                    player.sendMessage(ChatColor.RED + "" + ChatColor.BOLD + "Has perecido ante la horda del mal. Tótems restablecidos a 10.");
                }
            }
        }.runTaskTimer(plugin, 0L, 5L);
    }

    public void cleanup() {
        if (hudTask != null) {
            hudTask.cancel();
        }
        if (bossBar != null) {
            bossBar.removeAll();
        }
    }
}
