package com.minelive.arcangel;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
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
import org.bukkit.entity.Monster;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.util.Vector;
import org.joml.Matrix4f;
import org.joml.Matrix4fc;

/**
 * Invocación Suprema: Arcángel Metatrón (Serafín de las Seis Alas de Fuego Divino)
 * MiniLiveArcangel v1.0.0
 * Arquitectura cinematográfica de ultra-detalle:
 * - Rig anatómico colosal de 70 piezas BlockDisplay articuladas con cinemática jerárquica JOML.
 * - 6 alas articuladas independientes con aleteo fisiológico sinusoidal desfasado.
 * - Gran Espada Sagrada de San Miguel de 10 metros de longitud (cristal, oro y amatista).
 * - Aureola Trinitaria / Ruedas de Ofanín con contrarotación continua.
 * - Descenso supersónico en picada desde Y+95 con estela de fuego celestial.
 * - Superhero Landing sísmico con eyección balística de 16 losas del terreno.
 * - Cambio atmosférico a medianoche cósmica (setPlayerTime) y tracking de cámara dinámico.
 * - Invocación del "Sol de Metatrón" sobre la palma izquierda con radio pulsante (latido cardíaco).
 * - Supernova Sagrada con ondas expansivas concéntricas de Sonic Boom (radio 24 bloques).
 * - Aniquilación de monstruos, curación completa y entrega de +20 Tótems de la Inmortalidad.
 */
public final class ArcangelShow {

    // Paleta de partículas celestiales
    private static final Color ORO = Color.fromRGB(255, 215, 0);
    private static final Color CIAN = Color.fromRGB(120, 235, 255);

    // Identificadores de Articulaciones Cinemáticas
    private static final int CUERPO = 0;
    private static final int FALDA = 1;
    private static final int CABEZA = 2;
    private static final int AUREOLA = 3;
    private static final int HOMBRO_D = 4;
    private static final int BRAZO_D = 5;
    private static final int MANO_D = 6;
    private static final int HOMBRO_I = 7;
    private static final int BRAZO_I = 8;
    private static final int MANO_I = 9;
    private static final int ALA_SUP_D = 10;
    private static final int ALA_SUP_I = 11;
    private static final int ALA_MED_D = 12;
    private static final int ALA_MED_I = 13;
    private static final int ALA_INF_D = 14;
    private static final int ALA_INF_I = 15;
    private static final int TOTAL_ARTICULACIONES = 16;

    // Definición de una Pieza Voxel Esculpida
    private record PiezaVoxel(
            int articulacion,
            Material material,
            float cx, float cy, float cz,
            float sx, float sy, float sz,
            float rx, float ry, float rz,
            int luz
    ) {
        Matrix4f formaLocal() {
            return new Matrix4f()
                    .translate(cx, cy, cz)
                    .rotateY(ry).rotateX(rx).rotateZ(rz)
                    .scale(sx, sy, sz)
                    .translate(-0.5f, -0.5f, -0.5f);
        }
    }

    // Definición de Losa Balística de Impacto Sísmico
    private static class LosaImpacto {
        final BlockDisplay display;
        final Vector velocidad;
        Location posActual;

        LosaImpacto(BlockDisplay display, Vector velocidad, Location posActual) {
            this.display = display;
            this.velocidad = velocidad;
            this.posActual = posActual;
        }
    }

    // Registro de Piezas Esculpidas del Serafín (70 Partes)
    private static final List<PiezaVoxel> MODELO_SERAFIN = construirModelo();

    private static List<PiezaVoxel> construirModelo() {
        List<PiezaVoxel> p = new ArrayList<>();

        // =====================================================================
        // 1. CUERPO Y PETO SAGRADO (CUERPO = 0)
        // =====================================================================
        p.add(new PiezaVoxel(CUERPO, Material.OCHRE_FROGLIGHT, 0f, 13.8f, 0.4f, 1.4f, 1.6f, 1.4f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CUERPO, Material.DIAMOND_BLOCK, 0f, 14.1f, 1.15f, 0.7f, 0.9f, 0.4f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CUERPO, Material.GOLD_BLOCK, -1.35f, 14.0f, 0.6f, 1.9f, 2.0f, 1.2f, 0.08f, 0.12f, 0f, 15));
        p.add(new PiezaVoxel(CUERPO, Material.GOLD_BLOCK, 1.35f, 14.0f, 0.6f, 1.9f, 2.0f, 1.2f, 0.08f, -0.12f, 0f, 15));
        p.add(new PiezaVoxel(CUERPO, Material.RAW_GOLD_BLOCK, 0f, 15.2f, 0.4f, 3.8f, 0.6f, 1.2f, 0f, 0f, 0f, 14));
        p.add(new PiezaVoxel(CUERPO, Material.RAW_GOLD_BLOCK, 0f, 12.3f, 0.65f, 2.4f, 1.1f, 0.9f, 0f, 0f, 0f, 13));
        p.add(new PiezaVoxel(CUERPO, Material.GOLD_BLOCK, 0f, 11.1f, 0.55f, 2.2f, 1.0f, 0.85f, 0f, 0f, 0f, 13));
        p.add(new PiezaVoxel(CUERPO, Material.RAW_GOLD_BLOCK, 0f, 9.9f, 0.45f, 2.0f, 1.0f, 0.8f, 0f, 0f, 0f, 12));
        p.add(new PiezaVoxel(CUERPO, Material.GOLD_BLOCK, 0f, 8.7f, 0.1f, 3.2f, 1.1f, 2.0f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CUERPO, Material.DIAMOND_BLOCK, 0f, 8.7f, 1.15f, 0.9f, 0.9f, 0.35f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CUERPO, Material.GOLD_BLOCK, 0f, 13.5f, -0.8f, 3.6f, 3.8f, 1.0f, -0.05f, 0f, 0f, 14));
        p.add(new PiezaVoxel(CUERPO, Material.SMOOTH_QUARTZ, 0f, 13.2f, -1.35f, 2.4f, 2.8f, 0.4f, 0f, 0f, 0f, 15));

        // =====================================================================
        // 2. TÚNICA SAGRADA Y VESTIDURAS CELESTIALES (FALDA = 1)
        // =====================================================================
        p.add(new PiezaVoxel(FALDA, Material.SMOOTH_QUARTZ, 0f, 4.8f, 0.85f, 2.8f, 6.8f, 0.45f, 0.08f, 0f, 0f, 15));
        p.add(new PiezaVoxel(FALDA, Material.WHITE_CONCRETE, -1.1f, 4.4f, 0.7f, 1.2f, 6.2f, 0.4f, 0.06f, 0.15f, 0f, 14));
        p.add(new PiezaVoxel(FALDA, Material.WHITE_CONCRETE, 1.1f, 4.4f, 0.7f, 1.2f, 6.2f, 0.4f, 0.06f, -0.15f, 0f, 14));
        p.add(new PiezaVoxel(FALDA, Material.SMOOTH_QUARTZ, -1.8f, 4.2f, 0.1f, 0.45f, 6.6f, 2.2f, 0f, 0f, 0.06f, 14));
        p.add(new PiezaVoxel(FALDA, Material.SMOOTH_QUARTZ, 1.8f, 4.2f, 0.1f, 0.45f, 6.6f, 2.2f, 0f, 0f, -0.06f, 14));
        p.add(new PiezaVoxel(FALDA, Material.WHITE_CONCRETE, 0f, 4.5f, -0.95f, 3.4f, 7.2f, 0.45f, -0.08f, 0f, 0f, 14));
        p.add(new PiezaVoxel(FALDA, Material.GOLD_BLOCK, 0f, 1.0f, 0.88f, 3.0f, 0.6f, 0.5f, 0.08f, 0f, 0f, 15));
        p.add(new PiezaVoxel(FALDA, Material.GOLD_BLOCK, 0f, 0.6f, -1.0f, 3.6f, 0.6f, 0.5f, -0.08f, 0f, 0f, 15));

        // =====================================================================
        // 3. CABEZA, MÁSCARA Y YELMO SERAFÍN (CABEZA = 2)
        // =====================================================================
        p.add(new PiezaVoxel(CABEZA, Material.RAW_GOLD_BLOCK, 0f, 16.0f, 0.2f, 1.6f, 1.2f, 1.6f, 0f, 0f, 0f, 14));
        p.add(new PiezaVoxel(CABEZA, Material.SMOOTH_QUARTZ, 0f, 17.6f, 0.35f, 1.9f, 2.2f, 1.9f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CABEZA, Material.PEARLESCENT_FROGLIGHT, 0f, 17.65f, 1.15f, 1.6f, 0.8f, 0.45f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CABEZA, Material.DIAMOND_BLOCK, -0.55f, 17.75f, 1.32f, 0.35f, 0.35f, 0.2f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CABEZA, Material.DIAMOND_BLOCK, 0.55f, 17.75f, 1.32f, 0.35f, 0.35f, 0.2f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CABEZA, Material.GOLD_BLOCK, 0f, 18.9f, 0.2f, 2.2f, 0.8f, 2.2f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CABEZA, Material.RAW_GOLD_BLOCK, 0f, 19.8f, 0.0f, 0.6f, 1.8f, 2.4f, 0.15f, 0f, 0f, 15));
        p.add(new PiezaVoxel(CABEZA, Material.GOLD_BLOCK, -1.25f, 18.2f, 0.2f, 0.45f, 1.8f, 1.4f, 0f, 0f, -0.2f, 14));
        p.add(new PiezaVoxel(CABEZA, Material.GOLD_BLOCK, 1.25f, 18.2f, 0.2f, 0.45f, 1.8f, 1.4f, 0f, 0f, 0.2f, 14));

        // =====================================================================
        // 4. AUREOLA TRINITARIA Y RUEDAS DE OFANÍN (AUREOLA = 3)
        // =====================================================================
        for (int i = 0; i < 4; i++) {
            double ang = i * (Math.PI / 2.0);
            float hx = (float) Math.cos(ang) * 1.8f;
            float hz = (float) Math.sin(ang) * 1.8f;
            p.add(new PiezaVoxel(AUREOLA, Material.OCHRE_FROGLIGHT, hx, 20.8f, hz, 0.7f, 0.35f, 0.7f, 0f, (float) ang, 0f, 15));
        }
        for (int i = 0; i < 6; i++) {
            double ang = i * (Math.PI / 3.0);
            float hx = (float) Math.cos(ang) * 3.2f;
            float hz = (float) Math.sin(ang) * 3.2f;
            Material m = (i % 2 == 0) ? Material.BEACON : Material.GOLD_BLOCK;
            p.add(new PiezaVoxel(AUREOLA, m, hx, 21.2f, hz, 0.65f, 0.4f, 0.65f, 0.1f, (float) ang, 0.1f, 15));
        }

        // =====================================================================
        // 5. HOMBRERAS Y BRAZOS ARTICULADOS (HOMBRO / BRAZO / MANO)
        // =====================================================================
        p.add(new PiezaVoxel(HOMBRO_D, Material.GOLD_BLOCK, -2.4f, 14.8f, 0.2f, 1.8f, 1.8f, 2.0f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(HOMBRO_D, Material.RAW_GOLD_BLOCK, -2.8f, 15.6f, 0.2f, 1.6f, 1.2f, 2.4f, 0f, 0f, 0.25f, 15));
        p.add(new PiezaVoxel(HOMBRO_D, Material.SMOOTH_QUARTZ, -3.2f, 16.4f, 0.2f, 1.2f, 1.4f, 2.6f, 0f, 0f, 0.45f, 15));
        p.add(new PiezaVoxel(BRAZO_D, Material.GOLD_BLOCK, -2.5f, 12.8f, 0.2f, 1.3f, 2.6f, 1.3f, 0f, 0f, 0f, 14));
        p.add(new PiezaVoxel(BRAZO_D, Material.RAW_GOLD_BLOCK, -2.5f, 10.4f, 0.2f, 1.4f, 2.8f, 1.4f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.GOLD_BLOCK, -2.5f, 8.8f, 0.2f, 1.3f, 1.3f, 1.3f, 0f, 0f, 0f, 15));

        p.add(new PiezaVoxel(HOMBRO_I, Material.GOLD_BLOCK, 2.4f, 14.8f, 0.2f, 1.8f, 1.8f, 2.0f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(HOMBRO_I, Material.RAW_GOLD_BLOCK, 2.8f, 15.6f, 0.2f, 1.6f, 1.2f, 2.4f, 0f, 0f, -0.25f, 15));
        p.add(new PiezaVoxel(HOMBRO_I, Material.SMOOTH_QUARTZ, 3.2f, 16.4f, 0.2f, 1.2f, 1.4f, 2.6f, 0f, 0f, -0.45f, 15));
        p.add(new PiezaVoxel(BRAZO_I, Material.GOLD_BLOCK, 2.5f, 12.8f, 0.2f, 1.3f, 2.6f, 1.3f, 0f, 0f, 0f, 14));
        p.add(new PiezaVoxel(BRAZO_I, Material.RAW_GOLD_BLOCK, 2.5f, 10.4f, 0.2f, 1.4f, 2.8f, 1.4f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_I, Material.GOLD_BLOCK, 2.5f, 8.8f, 0.2f, 1.3f, 1.3f, 1.3f, 0f, 0f, 0f, 15));

        // =====================================================================
        // 6. GRAN ESPADA SAGRADA DE SAN MIGUEL (10 METROS) (MANO_D = 6)
        // =====================================================================
        p.add(new PiezaVoxel(MANO_D, Material.RAW_GOLD_BLOCK, -2.5f, 7.8f, 0.2f, 0.7f, 0.7f, 0.7f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.GOLD_BLOCK, -2.5f, 8.6f, 0.2f, 0.45f, 1.8f, 0.45f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.GOLD_BLOCK, -2.5f, 9.6f, 0.2f, 3.2f, 0.6f, 0.8f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.DIAMOND_BLOCK, -2.5f, 9.6f, 0.65f, 0.7f, 0.7f, 0.3f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.AMETHYST_BLOCK, -2.5f, 11.2f, 0.2f, 0.8f, 2.6f, 0.35f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.SEA_LANTERN, -2.5f, 13.8f, 0.2f, 0.95f, 2.8f, 0.3f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.PEARLESCENT_FROGLIGHT, -2.5f, 16.4f, 0.2f, 0.8f, 2.6f, 0.25f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(MANO_D, Material.SMOOTH_QUARTZ, -2.5f, 18.6f, 0.2f, 0.5f, 2.2f, 0.2f, 0f, 0f, 0f, 15));

        // =====================================================================
        // 7. SEIS ALAS ARTICULADAS DE SERAFÍN (18 PIEZAS GRADUADAS)
        // =====================================================================
        // Ala Superior Derecha
        p.add(new PiezaVoxel(ALA_SUP_D, Material.GOLD_BLOCK, -1.8f, 16.0f, -1.2f, 0.55f, 3.8f, 0.75f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(ALA_SUP_D, Material.SMOOTH_QUARTZ, -3.2f, 18.8f, -1.4f, 0.4f, 4.6f, 1.8f, 0.1f, -0.2f, 0.2f, 15));
        p.add(new PiezaVoxel(ALA_SUP_D, Material.SEA_LANTERN, -4.6f, 22.0f, -1.6f, 0.3f, 4.2f, 1.4f, 0.15f, -0.3f, 0.35f, 15));
        // Ala Superior Izquierda
        p.add(new PiezaVoxel(ALA_SUP_I, Material.GOLD_BLOCK, 1.8f, 16.0f, -1.2f, 0.55f, 3.8f, 0.75f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(ALA_SUP_I, Material.SMOOTH_QUARTZ, 3.2f, 18.8f, -1.4f, 0.4f, 4.6f, 1.8f, 0.1f, 0.2f, -0.2f, 15));
        p.add(new PiezaVoxel(ALA_SUP_I, Material.SEA_LANTERN, 4.6f, 22.0f, -1.6f, 0.3f, 4.2f, 1.4f, 0.15f, 0.3f, -0.35f, 15));

        // Ala Media Derecha
        p.add(new PiezaVoxel(ALA_MED_D, Material.RAW_GOLD_BLOCK, -2.0f, 13.0f, -1.4f, 0.5f, 3.0f, 0.7f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(ALA_MED_D, Material.WHITE_CONCRETE, -4.2f, 13.6f, -1.6f, 0.35f, 3.6f, 1.6f, 0f, -0.25f, 0.5f, 14));
        p.add(new PiezaVoxel(ALA_MED_D, Material.PEARLESCENT_FROGLIGHT, -6.6f, 14.2f, -1.8f, 0.25f, 3.2f, 1.2f, 0f, -0.35f, 0.7f, 15));
        // Ala Media Izquierda
        p.add(new PiezaVoxel(ALA_MED_I, Material.RAW_GOLD_BLOCK, 2.0f, 13.0f, -1.4f, 0.5f, 3.0f, 0.7f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(ALA_MED_I, Material.WHITE_CONCRETE, 4.2f, 13.6f, -1.6f, 0.35f, 3.6f, 1.6f, 0f, 0.25f, -0.5f, 14));
        p.add(new PiezaVoxel(ALA_MED_I, Material.PEARLESCENT_FROGLIGHT, 6.6f, 14.2f, -1.8f, 0.25f, 3.2f, 1.2f, 0f, 0.35f, -0.7f, 15));

        // Ala Inferior Derecha
        p.add(new PiezaVoxel(ALA_INF_D, Material.GOLD_BLOCK, -1.6f, 10.0f, -1.2f, 0.5f, 2.8f, 0.65f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(ALA_INF_D, Material.SMOOTH_QUARTZ, -3.0f, 7.6f, -1.0f, 0.35f, 4.0f, 1.8f, -0.1f, -0.15f, -0.2f, 14));
        p.add(new PiezaVoxel(ALA_INF_D, Material.RAW_GOLD_BLOCK, -4.2f, 5.0f, -0.8f, 0.25f, 3.4f, 1.4f, -0.15f, -0.25f, -0.35f, 15));
        // Ala Inferior Izquierda
        p.add(new PiezaVoxel(ALA_INF_I, Material.GOLD_BLOCK, 1.6f, 10.0f, -1.2f, 0.5f, 2.8f, 0.65f, 0f, 0f, 0f, 15));
        p.add(new PiezaVoxel(ALA_INF_I, Material.SMOOTH_QUARTZ, 3.0f, 7.6f, -1.0f, 0.35f, 4.0f, 1.8f, -0.1f, 0.15f, 0.2f, 14));
        p.add(new PiezaVoxel(ALA_INF_I, Material.RAW_GOLD_BLOCK, 4.2f, 5.0f, -0.8f, 0.25f, 3.4f, 1.4f, -0.15f, 0.25f, 0.35f, 15));

        return p;
    }

    // =========================================================================
    // POSES CINEMÁTICAS ARTICULADAS (ÁNGULOS EN RADIANES)
    // =========================================================================
    private record CinemPose(
            float subidaY,
            float torsoInclinacion,
            float torsoGiro,
            float cabezaPitch,
            float cabezaYaw,
            float aureolaSpin,
            float hombroDX, float hombroDZ,
            float hombroIX, float hombroIZ,
            float alaSupAbre, float alaMedAbre, float alaInfAbre
    ) {
        CinemPose lerp(CinemPose b, float t) {
            return new CinemPose(
                    l(this.subidaY, b.subidaY, t),
                    l(this.torsoInclinacion, b.torsoInclinacion, t),
                    l(this.torsoGiro, b.torsoGiro, t),
                    l(this.cabezaPitch, b.cabezaPitch, t),
                    l(this.cabezaYaw, b.cabezaYaw, t),
                    l(this.aureolaSpin, b.aureolaSpin, t),
                    l(this.hombroDX, b.hombroDX, t),
                    l(this.hombroDZ, b.hombroDZ, t),
                    l(this.hombroIX, b.hombroIX, t),
                    l(this.hombroIZ, b.hombroIZ, t),
                    l(this.alaSupAbre, b.alaSupAbre, t),
                    l(this.alaMedAbre, b.alaMedAbre, t),
                    l(this.alaInfAbre, b.alaInfAbre, t)
            );
        }

        private static float l(float a, float b, float t) {
            return a + (b - a) * t;
        }
    }

    private static final CinemPose POSE_CAYENDO = new CinemPose(
            90.0f, -0.75f, 0f, 0.45f, 0f, 0f,
            -0.6f, 0.1f, -0.6f, -0.1f,
            -0.85f, -0.95f, -0.85f
    );

    private static final CinemPose POSE_ATERRIZAJE = new CinemPose(
            -2.5f, 0.65f, 0.15f, -0.35f, 0f, 1.2f,
            0.5f, 0.2f, -0.2f, -0.3f,
            0.65f, 0.75f, 0.4f
    );

    private static final CinemPose POSE_ERGUIDO = new CinemPose(
            0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f,
            0.0f, 0.15f, 0.0f, -0.15f,
            0.0f, 0.0f, 0.0f
    );

    private static final CinemPose POSE_INVOCACION = new CinemPose(
            0.8f, -0.15f, -0.2f, 0.35f, 0.25f, 2.5f,
            0.2f, 0.35f, -2.75f, -0.45f,
            0.45f, 0.6f, -0.25f
    );

    private final JavaPlugin plugin;
    private final Runnable alTerminar;
    private final AtomicBoolean activo = new AtomicBoolean(false);

    private BukkitTask task;
    private UUID targetUUID;
    private Location ancla;
    private float angelYaw;

    private final List<BlockDisplay> displaysModelo = new ArrayList<>();
    private final List<BlockDisplay> displaysSol = new ArrayList<>();
    private final List<LosaImpacto> losasDebris = new ArrayList<>();

    public ArcangelShow(JavaPlugin plugin, Runnable alTerminar) {
        this.plugin = plugin;
        this.alTerminar = alTerminar;
    }

    public boolean lanzar(Player target, Opciones opciones) {
        if (!activo.compareAndSet(false, true)) {
            return false;
        }

        this.targetUUID = target.getUniqueId();
        Location playerLoc = target.getLocation();
        World world = playerLoc.getWorld();
        if (world == null) {
            apagar();
            return false;
        }

        String donador = opciones.donador != null && !opciones.donador.isBlank() ? opciones.donador : "TikTok";

        // 1. ANUNCIO GLOBAL EN CHAT, TITLE Y ACTIONBAR
        String titulo = opciones.texto("titulo", "§6§l✦ ARCÁNGEL METATRÓN ✦");
        String subtitulo = opciones.texto("subtitulo", "§e§l¡Instasave Supremo de §b§l" + donador + "§e§l!");
        String chat = opciones.texto("chat", "§6§l[Arcángel] §e✧✧ ¡¡ARCÁNGEL METATRÓN INVOCADO POR §b" + donador.toUpperCase() + "§e!! ✧✧");

        Title titleComponent = Title.title(
                Component.text(titulo),
                Component.text(subtitulo),
                Title.Times.times(Duration.ofMillis(200), Duration.ofSeconds(5), Duration.ofMillis(300))
        );
        target.showTitle(titleComponent);

        if (!chat.isBlank()) {
            Bukkit.broadcast(Component.text(chat));
        }

        // 2. ATMÓSFERA: CAMBIO DE CIELO A NOCHE DE ECLIPSE
        target.setPlayerTime(18000L, false);

        // 3. ANCLAJE CINEMÁTICO EN EL SUELO (7 BLOQUES FRENTE AL JUGADOR)
        Vector dir = playerLoc.getDirection().setY(0).normalize();
        if (dir.lengthSquared() < 0.01) dir = new Vector(0, 0, 1);

        this.ancla = playerLoc.clone().add(dir.clone().multiply(7.0));
        this.ancla.setY(playerLoc.getY());
        this.angelYaw = (float) Math.toDegrees(Math.atan2(-dir.getX(), dir.getZ()));
        this.ancla.setYaw(angelYaw);

        // 4. INSTANCIACIÓN CLIENT-SIDE INTERPOLADA DE LAS 70 PIEZAS VOXEL
        for (PiezaVoxel pieza : MODELO_SERAFIN) {
            BlockDisplay disp = world.spawn(ancla, BlockDisplay.class, d -> {
                d.setBlock(pieza.material().createBlockData());
                d.setBrightness(new Display.Brightness(pieza.luz(), 15));
                d.setViewRange(160f);
                d.setPersistent(false);
                d.setInterpolationDelay(0);
                d.setInterpolationDuration(1);
                d.setTransformationMatrix(new Matrix4f().scale(0.001f));
            });
            displaysModelo.add(disp);
        }

        // 5. SOL CELESTIAL / MAÑANA RADIANTE (3 CAPAS CONCÉNTRICAS)
        BlockDisplay solNucleo = world.spawn(ancla, BlockDisplay.class, d -> {
            d.setBlock(Material.SEA_LANTERN.createBlockData());
            d.setBrightness(new Display.Brightness(15, 15));
            d.setPersistent(false);
            d.setInterpolationDuration(1);
            d.setTransformationMatrix(new Matrix4f().scale(0.001f));
        });
        BlockDisplay solCorona = world.spawn(ancla, BlockDisplay.class, d -> {
            d.setBlock(Material.PEARLESCENT_FROGLIGHT.createBlockData());
            d.setBrightness(new Display.Brightness(15, 15));
            d.setPersistent(false);
            d.setInterpolationDuration(1);
            d.setTransformationMatrix(new Matrix4f().scale(0.001f));
        });
        BlockDisplay solAura = world.spawn(ancla, BlockDisplay.class, d -> {
            d.setBlock(Material.OCHRE_FROGLIGHT.createBlockData());
            d.setBrightness(new Display.Brightness(15, 15));
            d.setPersistent(false);
            d.setInterpolationDuration(1);
            d.setTransformationMatrix(new Matrix4f().scale(0.001f));
        });
        displaysSol.add(solNucleo);
        displaysSol.add(solCorona);
        displaysSol.add(solAura);

        // 6. BUCLE CINEMÁTICO PRINCIPAL (60 FPS CLIENT INTERPOLADO)
        this.task = Bukkit.getScheduler().runTaskTimer(plugin, new Runnable() {
            int ticks = 0;
            boolean impactoRealizado = false;
            final Particle.DustOptions goldDust = new Particle.DustOptions(ORO, 1.8f);
            final Particle.DustOptions cyanDust = new Particle.DustOptions(CIAN, 1.6f);

            @Override
            public void run() {
                Player p = Bukkit.getPlayer(targetUUID);
                if (p == null || !p.isOnline() || displaysModelo.isEmpty()) {
                    apagar();
                    return;
                }

                ticks += 2;

                // FASE 1: DESCENSO SUPERSÓNICO (Ticks 0 a 30)
                if (ticks < 30) {
                    float prog = ticks / 30.0f;
                    float yCaida = 95.0f * (1.0f - prog * prog);
                    CinemPose poseActual = POSE_CAYENDO.lerp(POSE_ATERRIZAJE, prog * 0.35f);
                    poseActual = new CinemPose(
                            yCaida,
                            poseActual.torsoInclinacion(),
                            poseActual.torsoGiro(),
                            poseActual.cabezaPitch(),
                            poseActual.cabezaYaw(),
                            poseActual.aureolaSpin() + (ticks * 0.15f),
                            poseActual.hombroDX(), poseActual.hombroDZ(),
                            poseActual.hombroIX(), poseActual.hombroIZ(),
                            poseActual.alaSupAbre(), poseActual.alaMedAbre(), poseActual.alaInfAbre()
                    );

                    actualizarEsqueleto(displaysModelo, poseActual, ticks);

                    Location puntoCaida = ancla.clone().add(0, yCaida + 10.0, 0);
                    apuntarJugador(p, puntoCaida);

                    if (ticks == 2) {
                        world.playSound(p.getLocation(), Sound.ITEM_ELYTRA_FLYING, 3.0f, 0.5f);
                        world.playSound(p.getLocation(), Sound.BLOCK_BEACON_ACTIVATE, 2.5f, 0.4f);
                    }
                    world.playSound(puntoCaida, Sound.ENTITY_PHANTOM_FLAP, 2.0f, 1.4f);

                    for (double h = yCaida; h < yCaida + 14.0; h += 2.5) {
                        double ang = ticks * 0.5 + (h * 0.3);
                        world.spawnParticle(Particle.END_ROD, ancla.getX() + Math.cos(ang) * 1.8, ancla.getY() + h, ancla.getZ() + Math.sin(ang) * 1.8, 1, 0, 0, 0, 0);
                        world.spawnParticle(Particle.SOUL_FIRE_FLAME, ancla.getX() - Math.cos(ang) * 1.8, ancla.getY() + h, ancla.getZ() - Math.sin(ang) * 1.8, 1, 0, 0, 0, 0);
                    }
                }

                // FASE 2: IMPACTO SÍSMICO Y CRÁTER DE LOSAS (Ticks 30 a 54)
                else if (ticks < 54) {
                    if (!impactoRealizado) {
                        impactoRealizado = true;

                        world.strikeLightningEffect(ancla);
                        world.spawnParticle(Particle.FLASH, ancla, 8, 2.0, 1.0, 2.0, 0.1);
                        world.spawnParticle(Particle.SONIC_BOOM, ancla.clone().add(0, 0.5, 0), 2, 0, 0, 0, 0);
                        world.spawnParticle(Particle.EXPLOSION_HUGE, ancla, 4, 1.5, 0.5, 1.5, 0.1);

                        world.playSound(ancla, Sound.ENTITY_GENERIC_EXPLODE, 3.0f, 0.6f);
                        world.playSound(ancla, Sound.BLOCK_ANVIL_LAND, 3.0f, 0.5f);
                        world.playSound(ancla, Sound.ITEM_TRIDENT_THUNDER, 2.5f, 1.2f);

                        // EYECCIÓN DE 16 LOSAS BALÍSTICAS
                        for (int i = 0; i < 16; i++) {
                            double ang = (Math.PI * 2.0 / 16.0) * i;
                            double vx = Math.cos(ang) * (0.35 + Math.random() * 0.4);
                            double vy = 0.55 + Math.random() * 0.65;
                            double vz = Math.sin(ang) * (0.35 + Math.random() * 0.4);
                            Material matDebris = (i % 3 == 0) ? Material.GOLD_BLOCK : (i % 2 == 0 ? Material.SMOOTH_QUARTZ : Material.RAW_GOLD_BLOCK);

                            BlockDisplay dispDebris = world.spawn(ancla.clone().add(0, 0.3, 0), BlockDisplay.class, bd -> {
                                bd.setBlock(matDebris.createBlockData());
                                bd.setBrightness(new Display.Brightness(15, 15));
                                bd.setPersistent(false);
                                bd.setInterpolationDuration(1);
                                bd.setTransformationMatrix(new Matrix4f().scale(0.7f, 0.45f, 0.7f).translate(-0.5f, -0.5f, -0.5f));
                            });
                            losasDebris.add(new LosaImpacto(dispDebris, new Vector(vx, vy, vz), ancla.clone().add(0, 0.3, 0)));
                        }
                    }

                    for (LosaImpacto l : losasDebris) {
                        l.posActual.add(l.velocidad);
                        l.velocidad.subtract(new Vector(0, 0.045, 0));
                        l.display.teleport(l.posActual);
                    }

                    float prog = (ticks - 30) / 24.0f;
                    CinemPose poseActual = POSE_ATERRIZAJE.lerp(POSE_ERGUIDO, prog);
                    actualizarEsqueleto(displaysModelo, poseActual, ticks);
                    apuntarJugador(p, ancla.clone().add(0, 8.0, 0));
                }

                // FASE 3: DESPERTAR Y ALETEO DE LAS 6 ALAS (Ticks 54 a 86)
                else if (ticks < 86) {
                    if (ticks % 8 == 0) {
                        world.playSound(ancla, Sound.BLOCK_AMETHYST_BLOCK_CHIME, 2.5f, 1.4f);
                        world.playSound(ancla, Sound.BLOCK_BEACON_AMBIENT, 2.0f, 1.2f);
                    }

                    dibujarSelloMetatron(ancla, 6.0, ticks * 0.08, goldDust, cyanDust);
                    actualizarEsqueleto(displaysModelo, POSE_ERGUIDO, ticks);
                    apuntarJugador(p, ancla.clone().add(0, 14.0, 0));
                }

                // FASE 4: INVOCACIÓN DEL SOL CELESTIAL DE METATRÓN (Ticks 86 a 124)
                else if (ticks < 124) {
                    float prog = (ticks - 86) / 38.0f;
                    CinemPose poseActual = POSE_ERGUIDO.lerp(POSE_INVOCACION, prog);
                    actualizarEsqueleto(displaysModelo, poseActual, ticks);

                    Location posSol = ancla.clone().add(rotarVector(new Vector(3.5, 17.5, 1.2), angelYaw));

                    double latido = Math.sin(ticks * 0.45) * 0.4;
                    float radioBase = (float) (0.9 + (prog * 3.2) + latido);

                    solNucleo.teleport(posSol);
                    solCorona.teleport(posSol);
                    solAura.teleport(posSol);

                    solNucleo.setTransformationMatrix(new Matrix4f().scale(radioBase * 0.7f).translate(-0.5f, -0.5f, -0.5f));
                    solCorona.setTransformationMatrix(new Matrix4f().scale(radioBase * 1.05f).translate(-0.5f, -0.5f, -0.5f));
                    solAura.setTransformationMatrix(new Matrix4f().scale(radioBase * 1.45f).translate(-0.5f, -0.5f, -0.5f));

                    if (ticks % 6 == 0) {
                        world.playSound(posSol, Sound.BLOCK_RESPAWN_ANCHOR_CHARGE, 2.0f, 1.0f + prog * 0.6f);
                        world.playSound(posSol, Sound.BLOCK_AMETHYST_BLOCK_RESONATE, 2.5f, 1.2f);
                    }

                    for (int i = 0; i < 18; i++) {
                        double ang = (Math.PI * 2.0 / 18.0) * i + (ticks * 0.25);
                        double r = radioBase * 1.6;
                        world.spawnParticle(Particle.TOTEM, posSol.getX() + Math.cos(ang) * r, posSol.getY() + Math.sin(ang * 2.0) * 0.6, posSol.getZ() + Math.sin(ang) * r, 2, 0.1, 0.1, 0.1, 0.02);
                        world.spawnParticle(Particle.END_ROD, posSol.getX() - Math.cos(ang) * r, posSol.getY(), posSol.getZ() - Math.sin(ang) * r, 1, 0, 0, 0, 0);
                    }

                    world.getNearbyEntities(ancla, 25.0, 12.0, 25.0).stream()
                            .filter(e -> e instanceof Monster)
                            .forEach(e -> {
                                Monster m = (Monster) e;
                                m.addPotionEffect(new PotionEffect(PotionEffectType.LEVITATION, 35, 1, false, false));
                                world.spawnParticle(Particle.SOUL_FIRE_FLAME, m.getLocation().add(0, 1, 0), 3, 0.2, 0.2, 0.2, 0.02);
                            });

                    dibujarSelloMetatron(ancla, 7.0, ticks * 0.14, goldDust, cyanDust);
                    apuntarJugador(p, posSol);
                }

                // FASE 5: SUPERNOVA SAGRADA Y RECOMPENSAS (Ticks >= 124)
                else {
                    Location puntoSupernova = ancla.clone().add(0, 2.0, 0);

                    try { p.resetPlayerTime(); } catch (Exception ignored) {}

                    world.strikeLightningEffect(puntoSupernova);
                    world.strikeLightningEffect(p.getLocation());
                    world.spawnParticle(Particle.FLASH, puntoSupernova, 20, 3.0, 3.0, 3.0, 0.1);
                    world.spawnParticle(Particle.TOTEM, puntoSupernova, 400, 6.0, 5.0, 6.0, 0.45);
                    world.spawnParticle(Particle.FIREWORKS_SPARK, puntoSupernova, 200, 5.0, 4.0, 5.0, 0.3);

                    world.playSound(puntoSupernova, Sound.ITEM_TOTEM_USE, 4.0f, 0.85f);
                    world.playSound(puntoSupernova, Sound.UI_TOAST_CHALLENGE_COMPLETE, 3.0f, 1.0f);
                    world.playSound(puntoSupernova, Sound.ENTITY_GENERIC_EXPLODE, 3.0f, 1.4f);
                    world.playSound(puntoSupernova, Sound.ENTITY_PLAYER_LEVELUP, 3.0f, 0.75f);

                    for (double r = 2.0; r <= 24.0; r += 3.2) {
                        for (double ang = 0; ang < Math.PI * 2.0; ang += Math.PI / 8.0) {
                            double ox = Math.cos(ang) * r;
                            double oz = Math.sin(ang) * r;
                            world.spawnParticle(Particle.SONIC_BOOM, puntoSupernova.getX() + ox, puntoSupernova.getY() + 0.3, puntoSupernova.getZ() + oz, 1, 0, 0, 0, 0);
                            world.spawnParticle(Particle.END_ROD, puntoSupernova.getX() + ox, puntoSupernova.getY() + 0.6, puntoSupernova.getZ() + oz, 1, 0, 0.1, 0, 0.05);
                        }
                    }

                    // Aniquilación de hostiles con 2500 de daño sagrado
                    world.getNearbyEntities(puntoSupernova, 30.0, 15.0, 30.0).stream()
                            .filter(e -> e instanceof Monster)
                            .forEach(e -> {
                                Monster m = (Monster) e;
                                m.damage(2500.0);
                                world.spawnParticle(Particle.FLASH, m.getLocation(), 2);
                                world.spawnParticle(Particle.SOUL_FIRE_FLAME, m.getLocation().add(0, 0.5, 0), 30, 0.4, 0.4, 0.4, 0.1);
                            });

                    // Recompensas al streamer
                    p.setHealth(p.getMaxHealth());
                    p.setFoodLevel(20);
                    p.setSaturation(20f);
                    p.addPotionEffect(new PotionEffect(PotionEffectType.REGENERATION, 500, 3, false, false));
                    p.addPotionEffect(new PotionEffect(PotionEffectType.ABSORPTION, 1000, 4, false, false));
                    p.addPotionEffect(new PotionEffect(PotionEffectType.GLOWING, 300, 0, false, false));

                    // Entregar Tótems directamente al inventario si MiniLiveTotems o vanilla
                    p.getInventory().addItem(new ItemStack(Material.TOTEM_OF_UNDYING, 2));

                    p.showTitle(Title.title(
                            Component.text("§a§l✦ ¡SALVACIÓN ALCANZADA! ✦"),
                            Component.text("§fBendición del Serafín Supremo"),
                            Title.Times.times(Duration.ofMillis(200), Duration.ofSeconds(4), Duration.ofMillis(300))
                    ));

                    apagar();
                }
            }
        }, 0L, 2L);

        return true;
    }

    public void apagar() {
        if (task != null) {
            task.cancel();
            task = null;
        }

        Player p = Bukkit.getPlayer(targetUUID);
        if (p != null && p.isOnline()) {
            try { p.resetPlayerTime(); } catch (Exception ignored) {}
        }

        for (BlockDisplay d : displaysModelo) {
            if (d != null && d.isValid()) d.remove();
        }
        for (BlockDisplay s : displaysSol) {
            if (s != null && s.isValid()) s.remove();
        }
        for (LosaImpacto l : losasDebris) {
            if (l.display != null && l.display.isValid()) l.display.remove();
        }
        displaysModelo.clear();
        displaysSol.clear();
        losasDebris.clear();

        if (activo.getAndSet(false)) {
            if (alTerminar != null) {
                alTerminar.run();
            }
        }
    }

    // =========================================================================
    // RESOLUTOR CINEMÁTICO JERÁRQUICO JOML
    // =========================================================================
    private static void actualizarEsqueleto(List<BlockDisplay> displays, CinemPose pose, int tick) {
        double aleteoSup = Math.sin(tick * 0.22) * 0.38 + pose.alaSupAbre();
        double aleteoMed = Math.sin(tick * 0.22 - 0.45) * 0.42 + pose.alaMedAbre();
        double aleteoInf = Math.sin(tick * 0.22 - 0.90) * 0.35 + pose.alaInfAbre();
        double ondeoRopa = Math.sin(tick * 0.18) * 0.12;

        Matrix4f[] articulaciones = new Matrix4f[TOTAL_ARTICULACIONES];

        Matrix4f mCuerpo = new Matrix4f()
                .translate(0f, pose.subidaY(), 0f)
                .translate(0f, 10.0f, 0f)
                .rotateX(pose.torsoInclinacion())
                .rotateY(pose.torsoGiro())
                .translate(0f, -10.0f, 0f);
        articulaciones[CUERPO] = mCuerpo;

        articulaciones[FALDA] = new Matrix4f(mCuerpo)
                .translate(0f, 8.7f, 0f)
                .rotateX((float) ondeoRopa);

        Matrix4f mCabeza = new Matrix4f(mCuerpo)
                .translate(0f, 16.0f, 0.2f)
                .rotateY(pose.cabezaYaw())
                .rotateX(pose.cabezaPitch());
        articulaciones[CABEZA] = mCabeza;

        articulaciones[AUREOLA] = new Matrix4f(mCabeza)
                .translate(0f, 4.2f, 0f)
                .rotateY(pose.aureolaSpin() + (float) (tick * 0.08))
                .rotateX(0.15f);

        Matrix4f mHombroD = new Matrix4f(mCuerpo)
                .translate(-2.4f, 14.8f, 0.2f)
                .rotateX(pose.hombroDX())
                .rotateZ(pose.hombroDZ());
        articulaciones[HOMBRO_D] = mHombroD;
        articulaciones[BRAZO_D] = mHombroD;
        articulaciones[MANO_D] = new Matrix4f(mHombroD)
                .translate(0f, -6.0f, 0f);

        Matrix4f mHombroI = new Matrix4f(mCuerpo)
                .translate(2.4f, 14.8f, 0.2f)
                .rotateX(pose.hombroIX())
                .rotateZ(pose.hombroIZ());
        articulaciones[HOMBRO_I] = mHombroI;
        articulaciones[BRAZO_I] = mHombroI;
        articulaciones[MANO_I] = new Matrix4f(mHombroI)
                .translate(0f, -6.0f, 0f);

        articulaciones[ALA_SUP_D] = new Matrix4f(mCuerpo)
                .translate(-1.8f, 16.0f, -1.2f)
                .rotateZ((float) aleteoSup)
                .rotateY((float) (aleteoSup * 0.3));
        articulaciones[ALA_SUP_I] = new Matrix4f(mCuerpo)
                .translate(1.8f, 16.0f, -1.2f)
                .rotateZ((float) -aleteoSup)
                .rotateY((float) (-aleteoSup * 0.3));

        articulaciones[ALA_MED_D] = new Matrix4f(mCuerpo)
                .translate(-2.0f, 13.0f, -1.4f)
                .rotateZ((float) aleteoMed)
                .rotateY((float) (aleteoMed * 0.45));
        articulaciones[ALA_MED_I] = new Matrix4f(mCuerpo)
                .translate(2.0f, 13.0f, -1.4f)
                .rotateZ((float) -aleteoMed)
                .rotateY((float) (-aleteoMed * 0.45));

        articulaciones[ALA_INF_D] = new Matrix4f(mCuerpo)
                .translate(-1.6f, 10.0f, -1.2f)
                .rotateZ((float) aleteoInf)
                .rotateY((float) (aleteoInf * 0.25));
        articulaciones[ALA_INF_I] = new Matrix4f(mCuerpo)
                .translate(1.6f, 10.0f, -1.2f)
                .rotateZ((float) -aleteoInf)
                .rotateY((float) (-aleteoInf * 0.25));

        for (int i = 0; i < displays.size() && i < MODELO_SERAFIN.size(); i++) {
            PiezaVoxel pieza = MODELO_SERAFIN.get(i);
            BlockDisplay disp = displays.get(i);

            Matrix4f matrizFinal = new Matrix4f((Matrix4fc) articulaciones[pieza.articulacion()])
                    .mul((Matrix4fc) pieza.formaLocal());

            disp.setTransformationMatrix(matrizFinal);
        }
    }

    private static void dibujarSelloMetatron(Location centro, double radio, double rot, Particle.DustOptions oro, Particle.DustOptions cian) {
        World w = centro.getWorld();
        if (w == null) return;

        double cy = centro.getY() + 0.15;
        for (int i = 0; i < 24; i++) {
            double a = (Math.PI * 2.0 / 24.0) * i + rot;
            w.spawnParticle(Particle.REDSTONE, centro.getX() + Math.cos(a) * radio, cy, centro.getZ() + Math.sin(a) * radio, 1, 0, 0, 0, 0, oro);
        }
        for (int k = 0; k < 6; k++) {
            double a1 = (Math.PI * 2.0 / 6.0) * k + rot;
            double a2 = (Math.PI * 2.0 / 6.0) * (k + 2) + rot;
            double p1x = centro.getX() + Math.cos(a1) * (radio * 0.85);
            double p1z = centro.getZ() + Math.sin(a1) * (radio * 0.85);
            double p2x = centro.getX() + Math.cos(a2) * (radio * 0.85);
            double p2z = centro.getZ() + Math.sin(a2) * (radio * 0.85);

            for (double s = 0; s <= 1.0; s += 0.25) {
                w.spawnParticle(Particle.REDSTONE, p1x + (p2x - p1x) * s, cy, p1z + (p2z - p1z) * s, 1, 0, 0, 0, 0, cian);
            }
        }
    }

    private static Vector rotarVector(Vector v, float grados) {
        double rad = Math.toRadians(grados);
        double cos = Math.cos(rad);
        double sin = Math.sin(rad);
        return new Vector(v.getX() * cos - v.getZ() * sin, v.getY(), v.getX() * sin + v.getZ() * cos);
    }

    private static void apuntarJugador(Player p, Location target) {
        Location eye = p.getEyeLocation();
        Vector dir = target.toVector().subtract(eye.toVector());
        if (dir.lengthSquared() < 0.001) return;

        dir.normalize();
        double dx = dir.getX();
        double dy = dir.getY();
        double dz = dir.getZ();

        double yaw = Math.toDegrees(Math.atan2(-dx, dz));
        double pitch = Math.toDegrees(Math.atan2(-dy, Math.sqrt(dx * dx + dz * dz)));

        Location loc = p.getLocation();
        loc.setYaw((float) yaw);
        loc.setPitch((float) pitch);
        p.teleport(loc);
    }
}
