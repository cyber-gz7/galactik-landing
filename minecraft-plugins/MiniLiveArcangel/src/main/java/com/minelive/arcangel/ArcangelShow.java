package com.minelive.arcangel;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicBoolean;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.title.Title;
import org.bukkit.Bukkit;
import org.bukkit.Color;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.World;
import org.bukkit.entity.BlockDisplay;
import org.bukkit.entity.Display;
import org.bukkit.entity.Entity;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.util.Transformation;
import org.bukkit.util.Vector;
import org.joml.AxisAngle4f;
import org.joml.Matrix4f;
import org.joml.Vector3f;

public final class ArcangelShow {
    private static final int PHASE1_END = 60;
    private static final int PHASE2_END = 90;
    private static final int COLLAPSE_START = 91;
    private static final int COLLAPSE_END = 95;
    private static final int DETONATION_TICK = 96;
    private static final int CLEANUP_TICK = 97;

    private static final float SCALE_TARGET = 3.0f;
    private static final double FOCAL_Y_OFFSET = 12.0;
    private static final double RING1_RADIUS = 4.0;
    private static final double RING2_RADIUS = 4.0;
    private static final double RING3_RADIUS = 5.5;

    private final JavaPlugin plugin;
    private final Runnable alTerminar;
    private final AtomicBoolean activo = new AtomicBoolean(false);

    private BukkitTask task;
    private UUID targetUUID;
    private Location focalPoint;
    private Location groundLoc;
    private double initialFocalY;

    private BlockDisplay coreDisplay;
    private final List<ItemDisplay> ring1Displays = new ArrayList<>();
    private final List<ItemDisplay> ring2Displays = new ArrayList<>();

    private int tick = 0;
    private double ring1Angle = 0.0;
    private double ring2Angle = 0.0;
    private double ring3Angle = 0.0;

    public ArcangelShow(JavaPlugin plugin, Runnable alTerminar) {
        this.plugin = plugin;
        this.alTerminar = alTerminar;
    }

    public boolean lanzar(Player target, Opciones opciones) {
        if (!activo.compareAndSet(false, true)) {
            return false;
        }

        this.targetUUID = target.getUniqueId();
        this.groundLoc = target.getLocation().clone();
        this.focalPoint = groundLoc.clone().add(0, FOCAL_Y_OFFSET, 0);
        this.initialFocalY = focalPoint.getY();

        World world = focalPoint.getWorld();
        if (world == null) {
            apagar();
            return false;
        }

        String titulo = opciones.texto("titulo", plugin.getConfig().getString("messages.title", "&e&l✧ OFANIM CELESTIAL ✧"));
        String subtitulo = opciones.texto("subtitulo", plugin.getConfig().getString("messages.subtitle", "&fCastigo solar de &b{donor}"));
        String chat = opciones.texto("chat", plugin.getConfig().getString("messages.chat", "&6&l[Arcángel] &e¡{donor} invocó el Ofanim Celestial sobre &f{target}&e!"));

        Title titleComponent = Title.title(
                opciones.componente(titulo, target.getName()),
                opciones.componente(subtitulo, target.getName()),
                Title.Times.times(Duration.ofMillis(200), Duration.ofSeconds(4), Duration.ofMillis(300))
        );
        target.showTitle(titleComponent);

        if (!chat.isBlank()) {
            Bukkit.broadcast(opciones.componente(chat, target.getName()));
        }

        try {
            spawnEntities(world);
        } catch (Exception ex) {
            plugin.getLogger().warning("Error al ensamblar Ofanim Celestial: " + ex.getMessage());
            apagar();
            return false;
        }

        this.tick = 0;
        this.task = Bukkit.getScheduler().runTaskTimer(plugin, this::paso, 1L, 1L);
        return true;
    }

    private void spawnEntities(World world) {
        // Capa 1: Núcleo Solar Central (BlockDisplay)
        coreDisplay = world.spawn(focalPoint, BlockDisplay.class, d -> {
            d.setBlock(Material.GLOWSTONE.createBlockData());
            d.setBillboard(Display.Billboard.FIXED);
            d.setGlowColorOverride(Color.fromRGB(255, 215, 0));
            d.setGlowing(true);
            d.setBrightness(new Display.Brightness(15, 15));
            d.setPersistent(false);
            Transformation t = new Transformation(
                    new Vector3f(-0.125f, -0.125f, -0.125f),
                    new AxisAngle4f(),
                    new Vector3f(0.25f, 0.25f, 0.25f),
                    new AxisAngle4f()
            );
            d.setTransformation(t);
        });

        // Capa 2: Anillo 1 (8 ItemDisplay - Eje Horizontal Y)
        for (int i = 0; i < 8; i++) {
            ItemDisplay id = world.spawn(focalPoint, ItemDisplay.class, d -> {
                d.setItemStack(new ItemStack(Material.GOLDEN_SWORD));
                d.setBillboard(Display.Billboard.FIXED);
                d.setGlowColorOverride(Color.fromRGB(255, 215, 0));
                d.setGlowing(true);
                d.setBrightness(new Display.Brightness(15, 15));
                d.setPersistent(false);
                d.setTransformationMatrix(new Matrix4f().scale(0.001f));
            });
            ring1Displays.add(id);
        }

        // Capa 3: Anillo 2 (8 ItemDisplay - Eje Inclinado 45° X/Z)
        for (int i = 0; i < 8; i++) {
            ItemDisplay id = world.spawn(focalPoint, ItemDisplay.class, d -> {
                d.setItemStack(new ItemStack(Material.END_ROD));
                d.setBillboard(Display.Billboard.FIXED);
                d.setGlowColorOverride(Color.fromRGB(255, 255, 255));
                d.setGlowing(true);
                d.setBrightness(new Display.Brightness(15, 15));
                d.setPersistent(false);
                d.setTransformationMatrix(new Matrix4f().scale(0.001f));
            });
            ring2Displays.add(id);
        }
    }

    private void paso() {
        Player target = targetUUID != null ? Bukkit.getPlayer(targetUUID) : null;
        if (target == null || !target.isOnline() || !target.getWorld().equals(focalPoint.getWorld())) {
            apagar();
            return;
        }

        World world = focalPoint.getWorld();
        if (world == null) {
            apagar();
            return;
        }

        float currentScale;
        float yOffset = 0.0f;

        if (tick <= PHASE1_END) {
            // FASE 1: DESPLIEGUE (Ticks 0 a 60)
            float progress = (float) tick / (float) PHASE1_END;
            currentScale = 0.1f + (SCALE_TARGET - 0.1f) * progress;

            ring1Angle += Math.toRadians(6.0);
            ring2Angle -= Math.toRadians(6.0);
            ring3Angle += Math.toRadians(6.0);

            if (tick % 10 == 0) {
                float pitch = 0.5f + 1.0f * progress;
                world.playSound(focalPoint, Sound.BLOCK_BEACON_ACTIVATE, 2.0f, pitch);
            }

            renderConvergingRays(world, focalPoint);

        } else if (tick <= PHASE2_END) {
            // FASE 2: CONCENTRACIÓN Y DESBORDAMIENTO (Ticks 61 a 90)
            currentScale = SCALE_TARGET;

            // Velocidad de giro al triple (18 grados por tick)
            ring1Angle += Math.toRadians(18.0);
            ring2Angle -= Math.toRadians(18.0);
            ring3Angle += Math.toRadians(18.0);

            if (tick % 15 == 0) {
                world.playSound(focalPoint, Sound.BLOCK_CONDUIT_ATTACK_TARGET, 1.8f, 1.2f);
            }

            renderVerticalLightColumn(world, focalPoint, target.getLocation());

        } else if (tick <= COLLAPSE_END) {
            // FASE 3A: COLAPSO HACIA EL SUELO EN 5 TICKS (Ticks 91 a 95)
            currentScale = SCALE_TARGET;

            ring1Angle += Math.toRadians(18.0);
            ring2Angle -= Math.toRadians(18.0);
            ring3Angle += Math.toRadians(18.0);

            float collapseProgress = (float) (tick - COLLAPSE_START + 1) / 5.0f;
            double currentY = initialFocalY - (initialFocalY - groundLoc.getY()) * collapseProgress;
            yOffset = (float) (currentY - initialFocalY);

            world.spawnParticle(Particle.END_ROD, groundLoc.clone().add(0, yOffset + FOCAL_Y_OFFSET, 0), 10, 0.5, 0.5, 0.5, 0.1);
            world.playSound(groundLoc, Sound.ENTITY_FIREWORK_ROCKET_BLAST, 2.0f, 0.6f);

        } else if (tick == DETONATION_TICK) {
            // FASE 3B: DETONACIÓN EN TIERRA (Tick 96)
            currentScale = SCALE_TARGET;
            yOffset = (float) (groundLoc.getY() - initialFocalY);

            ejecutarDetonacion(world, groundLoc);

        } else {
            // FASE 4: DISIPACIÓN LIMPIA (Tick 97+)
            apagar();
            return;
        }

        actualizarTransformaciones(currentScale, yOffset);
        renderAnillo3(world, focalPoint, currentScale, yOffset);

        tick++;
    }

    private void actualizarTransformaciones(float scale, float yOffset) {
        float scaleNorm = Math.min(1.0f, scale / SCALE_TARGET);

        // Actualizar Núcleo Central
        if (coreDisplay != null && coreDisplay.isValid()) {
            float coreHalfSize = 1.25f * scaleNorm;
            float coreSize = 2.5f * scaleNorm;
            Transformation t = new Transformation(
                    new Vector3f(-coreHalfSize, yOffset - coreHalfSize, -coreHalfSize),
                    new AxisAngle4f((float) Math.toRadians(tick * 4), 0.577f, 0.577f, 0.577f),
                    new Vector3f(coreSize, coreSize, coreSize),
                    new AxisAngle4f()
            );
            coreDisplay.setTransformation(t);
            coreDisplay.setInterpolationDelay(0);
            coreDisplay.setInterpolationDuration(2);
        }

        // Actualizar Anillo 1 (Horizontal Y, radio 4)
        float r1 = (float) (RING1_RADIUS * scaleNorm);
        for (int i = 0; i < ring1Displays.size(); i++) {
            ItemDisplay id = ring1Displays.get(i);
            if (id == null || !id.isValid()) continue;
            double theta = ring1Angle + (i * 2.0 * Math.PI / 8.0);
            Matrix4f m = new Matrix4f();
            m.translate(0.0f, yOffset, 0.0f);
            m.rotateY((float) theta);
            m.translate(0.0f, 0.0f, r1);
            m.rotateZ((float) Math.toRadians(90.0));
            m.scale(1.2f * scaleNorm);
            id.setTransformationMatrix(m);
            id.setInterpolationDelay(0);
            id.setInterpolationDuration(2);
        }

        // Actualizar Anillo 2 (Inclinado 45° X/Z, radio 4, rotación contraria)
        float r2 = (float) (RING2_RADIUS * scaleNorm);
        for (int i = 0; i < ring2Displays.size(); i++) {
            ItemDisplay id = ring2Displays.get(i);
            if (id == null || !id.isValid()) continue;
            double theta = ring2Angle + (i * 2.0 * Math.PI / 8.0);
            Matrix4f m = new Matrix4f();
            m.translate(0.0f, yOffset, 0.0f);
            m.rotate((float) Math.toRadians(45.0), 1.0f, 0.0f, 1.0f);
            m.rotateY((float) theta);
            m.translate(0.0f, 0.0f, r2);
            m.rotateZ((float) Math.toRadians(90.0));
            m.scale(1.2f * scaleNorm);
            id.setTransformationMatrix(m);
            id.setInterpolationDelay(0);
            id.setInterpolationDuration(2);
        }
    }

    private static final Particle PARTICLE_EXPLOSION;
    static {
        Particle p = null;
        try {
            p = Particle.valueOf("EXPLOSION_EMITTER");
        } catch (IllegalArgumentException ignored) {
            try {
                p = Particle.valueOf("EXPLOSION_HUGE");
            } catch (IllegalArgumentException ignored2) {
                p = Particle.EXPLOSION_NORMAL;
            }
        }
        PARTICLE_EXPLOSION = p;
    }

    private void renderAnillo3(World world, Location center, float scale, float yOffset) {
        float scaleNorm = Math.min(1.0f, scale / SCALE_TARGET);
        float r3 = (float) (RING3_RADIUS * scaleNorm);
        if (r3 < 0.2f) return;

        for (int i = 0; i < 32; i++) {
            double a = (2.0 * Math.PI / 32.0) * i + ring3Angle;
            double y = yOffset + r3 * Math.sin(a);
            double z = r3 * Math.cos(a);
            Location p = center.clone().add(0, y, z);
            world.spawnParticle(Particle.END_ROD, p, 1, 0, 0, 0, 0);
        }
    }

    private void renderConvergingRays(World world, Location center) {
        if (tick % 2 == 0) {
            for (int k = 0; k < 3; k++) {
                double cloudAngle = ThreadLocalRandom.current().nextDouble(0, 2 * Math.PI);
                double cloudDist = ThreadLocalRandom.current().nextDouble(6.0, 11.0);
                double cloudY = ThreadLocalRandom.current().nextDouble(4.0, 9.0);
                Location cloudLoc = center.clone().add(
                        cloudDist * Math.cos(cloudAngle),
                        cloudY,
                        cloudDist * Math.sin(cloudAngle)
                );
                world.spawnParticle(Particle.FLASH, cloudLoc, 1, 0, 0, 0, 0);
                Vector dir = center.toVector().subtract(cloudLoc.toVector()).multiply(0.25);
                Location ray = cloudLoc.clone();
                for (int s = 0; s < 4; s++) {
                    ray.add(dir);
                    world.spawnParticle(Particle.END_ROD, ray, 1, 0, 0, 0, 0.02);
                }
            }
        }
    }

    private void renderVerticalLightColumn(World world, Location core, Location targetLoc) {
        double topY = core.getY();
        double bottomY = targetLoc.getY();
        for (double y = bottomY; y <= topY; y += 0.6) {
            Location colLoc = new Location(world, targetLoc.getX(), y, targetLoc.getZ());
            world.spawnParticle(Particle.END_ROD, colLoc, 2, 0.12, 0.0, 0.12, 0.01);
        }
        world.spawnParticle(Particle.FIREWORKS_SPARK, targetLoc.clone().add(0, 0.1, 0), 4, 0.6, 0.1, 0.6, 0.04);
    }

    private void ejecutarDetonacion(World world, Location impactLoc) {
        world.strikeLightningEffect(impactLoc);

        for (double r = 1.0; r <= 8.0; r += 1.5) {
            for (double a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
                double rx = r * Math.cos(a);
                double rz = r * Math.sin(a);
                Location waveLoc = impactLoc.clone().add(rx, 0.2, rz);
                world.spawnParticle(Particle.SONIC_BOOM, waveLoc, 1, 0, 0, 0, 0);
            }
        }
        if (PARTICLE_EXPLOSION != null) {
            world.spawnParticle(PARTICLE_EXPLOSION, impactLoc, 4, 1.0, 0.5, 1.0, 0);
        }

        world.playSound(impactLoc, Sound.ITEM_TRIDENT_THUNDER, 3.0f, 0.6f);

        for (Entity entity : world.getNearbyEntities(impactLoc, 7.0, 7.0, 7.0)) {
            if (entity instanceof Player) continue;
            Vector knock = entity.getLocation().toVector().subtract(impactLoc.toVector());
            if (knock.lengthSquared() < 0.001) {
                knock = new Vector(0, 1, 0);
            } else {
                knock.setY(0).normalize().multiply(2.0).setY(0.7);
            }
            entity.setVelocity(knock);
        }
    }

    public void apagar() {
        if (task != null) {
            task.cancel();
            task = null;
        }

        if (coreDisplay != null && !coreDisplay.isDead()) {
            coreDisplay.remove();
            coreDisplay = null;
        }

        for (ItemDisplay id : ring1Displays) {
            if (id != null && !id.isDead()) {
                id.remove();
            }
        }
        ring1Displays.clear();

        for (ItemDisplay id : ring2Displays) {
            if (id != null && !id.isDead()) {
                id.remove();
            }
        }
        ring2Displays.clear();

        if (activo.getAndSet(false)) {
            if (alTerminar != null) {
                alTerminar.run();
            }
        }
    }
}
