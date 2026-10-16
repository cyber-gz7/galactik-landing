package com.gz7.ruletabm;

import org.bukkit.Color;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.World;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.BlockDisplay;
import org.bukkit.entity.Display;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.ItemDisplay;
import org.bukkit.inventory.ItemStack;
import org.bukkit.util.Transformation;
import org.bukkit.util.Vector;
import org.joml.AxisAngle4f;
import org.joml.Vector3f;

import java.util.Collection;

public final class AnimationUtils {

    private AnimationUtils() {}

    public static ArmorStand spawnDisplayArmorStand(Location loc, boolean small) {
        World world = loc.getWorld();
        if (world == null) return null;

        return world.spawn(loc, ArmorStand.class, stand -> {
            stand.setVisible(false);
            stand.setGravity(false);
            stand.setSmall(small);
            stand.setBasePlate(false);
            stand.setArms(true);
            stand.setMarker(true);
            stand.setInvulnerable(true);
            stand.setCollidable(false);
        });
    }

    public static ItemDisplay spawnItemDisplay(Location loc, ItemStack item, Vector3f scale) {
        World world = loc.getWorld();
        if (world == null) return null;

        return world.spawn(loc, ItemDisplay.class, display -> {
            display.setItemStack(item);
            display.setBillboard(Display.Billboard.CENTER);
            display.setTransformation(new Transformation(
                    new Vector3f(0f, 0f, 0f),
                    new AxisAngle4f(0f, 0f, 1f, 0f),
                    scale,
                    new AxisAngle4f(0f, 0f, 1f, 0f)
            ));
        });
    }

    public static BlockDisplay spawnBlockDisplay(Location loc, Material material, Vector3f scale) {
        World world = loc.getWorld();
        if (world == null) return null;

        return world.spawn(loc, BlockDisplay.class, display -> {
            display.setBlock(material.createBlockData());
            display.setBillboard(Display.Billboard.CENTER);
            display.setTransformation(new Transformation(
                    new Vector3f(-scale.x / 2f, -scale.y / 2f, -scale.z / 2f),
                    new AxisAngle4f(0f, 0f, 1f, 0f),
                    scale,
                    new AxisAngle4f(0f, 0f, 1f, 0f)
            ));
        });
    }

    public static void updateDisplayTransform(Display display, Vector3f translation, AxisAngle4f rotation, Vector3f scale) {
        display.setTransformation(new Transformation(
                translation != null ? translation : new Vector3f(0f, 0f, 0f),
                rotation != null ? rotation : new AxisAngle4f(0f, 0f, 1f, 0f),
                scale != null ? scale : new Vector3f(1f, 1f, 1f),
                new AxisAngle4f(0f, 0f, 1f, 0f)
        ));
        display.setInterpolationDuration(2);
        display.setInterpolationDelay(0);
    }

    public static void spawnParticleRing(Location center, double radius, Particle particle, int points, double yOffset) {
        World world = center.getWorld();
        if (world == null) return;

        double increment = (2 * Math.PI) / points;
        for (int i = 0; i < points; i++) {
            double angle = i * increment;
            double x = center.getX() + (radius * Math.cos(angle));
            double z = center.getZ() + (radius * Math.sin(angle));
            world.spawnParticle(particle, x, center.getY() + yOffset, z, 1, 0, 0, 0, 0);
        }
    }

    public static void spawnParticleRingRotated(Location center, double radius, Particle particle, int points, double pitchAngle, double yawOffset) {
        World world = center.getWorld();
        if (world == null) return;

        double increment = (2 * Math.PI) / points;
        for (int i = 0; i < points; i++) {
            double angle = i * increment;
            double x = radius * Math.cos(angle);
            double y = radius * Math.sin(angle) * Math.sin(pitchAngle);
            double z = radius * Math.sin(angle) * Math.cos(pitchAngle);

            Vector v = new Vector(x, y, z);
            v = rotateAroundY(v, yawOffset);

            world.spawnParticle(particle, center.getX() + v.getX(), center.getY() + v.getY(), center.getZ() + v.getZ(), 1, 0, 0, 0, 0);
        }
    }

    public static void spawnHelix(Location base, double radius, double height, Particle particle, int loops, int totalPoints) {
        World world = base.getWorld();
        if (world == null) return;

        for (int i = 0; i < totalPoints; i++) {
            double progress = (double) i / totalPoints;
            double angle = progress * loops * 2 * Math.PI;
            double y = base.getY() + (progress * height);
            double x = base.getX() + (radius * Math.cos(angle));
            double z = base.getZ() + (radius * Math.sin(angle));
            world.spawnParticle(particle, x, y, z, 1, 0, 0, 0, 0);
        }
    }

    public static void spawnSphere(Location center, double radius, Particle particle, int density) {
        World world = center.getWorld();
        if (world == null) return;

        for (int i = 0; i < density; i++) {
            double u = Math.random();
            double v = Math.random();
            double theta = 2 * Math.PI * u;
            double phi = Math.acos(2 * v - 1);
            double x = center.getX() + (radius * Math.sin(phi) * Math.cos(theta));
            double y = center.getY() + (radius * Math.sin(phi) * Math.sin(theta));
            double z = center.getZ() + (radius * Math.cos(phi));
            world.spawnParticle(particle, x, y, z, 1, 0, 0, 0, 0);
        }
    }

    public static void playGlobalEffectSound(Location loc, Sound sound, float volume, float pitch) {
        World world = loc.getWorld();
        if (world == null) return;
        world.playSound(loc, sound, volume, pitch);
    }

    public static Vector rotateAroundY(Vector v, double angle) {
        double cos = Math.cos(angle);
        double sin = Math.sin(angle);
        double x = v.getX() * cos + v.getZ() * sin;
        double z = -v.getX() * sin + v.getZ() * cos;
        return new Vector(x, v.getY(), z);
    }
}
