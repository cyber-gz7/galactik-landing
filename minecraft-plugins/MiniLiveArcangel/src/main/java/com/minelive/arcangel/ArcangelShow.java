package com.minelive.arcangel;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicBoolean;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextDecoration;
import net.kyori.adventure.title.Title;
import org.bukkit.Bukkit;
import org.bukkit.Color;
import org.bukkit.GameMode;
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
import org.joml.Vector3f;

/**
 * Motor Cinemático Supremo: Arcángel Metatrón (Serafín de las Seis Alas de Fuego Sagrado).
 * MiniLiveArcangel v1.0.0
 * 
 * Re-arquitectura completa inspirada en MiniLiveSol (Escanor) y MiniLiveEsqueleto (La Parca):
 * - ~200 piezas BlockDisplay articuladas con interpolación nativa a 60-144 FPS.
 * - Sello geométrico de Metatrón 3D en el suelo dibujado con BlockDisplays de oro y linterna marina.
 * - Rotación matemática continua en Matrix4f (cero jitter o desincronización de paquetes).
 * - Eyección de 16 losas de terreno balísticas con gravedad.
 * - Orbe de Sol de la Aurora en la mano con 16 losas concéntricas pulsantes.
 * - Cascada de 20 Tótems de la Inmortalidad entregados con contador de action bar.
 */
public final class ArcangelShow {

    private static final Matrix4f NADA = new Matrix4f().scale(0.001f);
    private static final Color ORO = Color.fromRGB(255, 215, 0);
    private static final Color CIAN = Color.fromRGB(0, 240, 255);

    // Definición de Fragmento Balístico / Losa
    private static final class Trozo {
        final BlockDisplay display;
        final Vector3f pos;
        final Vector3f vel;
        final float tam;
        int edad;
        final int vida;

        Trozo(BlockDisplay display, Vector3f pos, Vector3f vel, float tam, int vida) {
            this.display = display;
            this.pos = pos;
            this.vel = vel;
            this.tam = tam;
            this.vida = vida;
            this.edad = 0;
        }
    }

    private final JavaPlugin plugin;
    private final Runnable alTerminar;
    private final AtomicBoolean activo = new AtomicBoolean(false);

    private BukkitTask task;
    private UUID targetUUID;
    private String donador;
    private Location ancla;
    private float angelYaw;
    private float escala = 1.0f;

    // Colecciones de Displays
    private final List<BlockDisplay> displaysModelo = new ArrayList<>();
    private final List<BlockDisplay> displaysSello = new ArrayList<>();
    private final List<float[]> lineasSelloForma = new ArrayList<>();
    private final List<BlockDisplay> displaysSol = new ArrayList<>();
    private final List<Trozo> trozos = new ArrayList<>();

    public ArcangelShow(JavaPlugin plugin, Runnable alTerminar) {
        this.plugin = plugin;
        this.alTerminar = alTerminar;
    }

    public boolean lanzar(Player target, Opciones opciones) {
        if (!activo.compareAndSet(false, true)) {
            return false;
        }

        this.targetUUID = target.getUniqueId();
        this.donador = opciones.donador != null && !opciones.donador.isBlank() ? opciones.donador : "TikTok";
        Location playerLoc = target.getLocation();
        World world = playerLoc.getWorld();
        if (world == null) {
            apagar();
            return false;
        }

        // 1. TÍTULOS Y CHAT BROADCAST
        String titulo = opciones.texto("titulo", "§6§l✦ ARCÁNGEL METATRÓN ✦");
        String subtitulo = opciones.texto("subtitulo", "§e§l¡Serafín Sagrado de §b§l" + donador + "§e§l!");
        String chat = opciones.texto("chat", "§6§l[Arcángel] §e✧✧ ¡¡ARCÁNGEL METATRÓN INVOCADO POR §b" + donador.toUpperCase() + "§e!! ✧✧");

        target.showTitle(Title.title(
                Component.text(titulo),
                Component.text(subtitulo),
                Title.Times.times(Duration.ofMillis(200), Duration.ofSeconds(5), Duration.ofMillis(300))
        ));

        if (!chat.isBlank()) {
            Bukkit.broadcast(Component.text(chat));
        }

        // 2. ATMÓSFERA: NOCHE DE ECLIPSE CÓSMICO
        target.setPlayerTime(18000L, false);

        // 3. ANCLAJE CINEMÁTICO: 8 BLOQUES AL FRENTE DEL JUGADOR
        Vector dir = playerLoc.getDirection().setY(0).normalize();
        if (dir.lengthSquared() < 0.01) dir = new Vector(0, 0, 1);

        this.ancla = playerLoc.clone().add(dir.clone().multiply(8.0));
        this.ancla.setY(encontrarSuelo(ancla));
        this.ancla.setYaw(0f);
        this.ancla.setPitch(0f);

        // Ángulo de orientación hacia el jugador
        double dx = playerLoc.getX() - ancla.getX();
        double dz = playerLoc.getZ() - ancla.getZ();
        this.angelYaw = (float) Math.atan2(dx, dz);

        this.escala = 1.0f;

        // 4. INSTANCIACIÓN DE LAS ~200 PIEZAS DEL MODELO VOXEL
        try {
            for (Arcangel.Parte parte : Arcangel.PARTES) {
                Material mat = Material.valueOf(parte.material());
                BlockDisplay disp = world.spawn(ancla, BlockDisplay.class, d -> {
                    d.setBlock(mat.createBlockData());
                    d.setBrightness(new Display.Brightness(parte.luz(), parte.luz()));
                    d.setViewRange(180f);
                    d.setPersistent(false);
                    d.setInterpolationDelay(0);
                    d.setInterpolationDuration(1);
                    d.setTransformationMatrix(NADA);
                    if (parte.glow()) {
                        d.setGlowing(true);
                        d.setGlowColorOverride(parte.glowColor());
                    }
                });
                displaysModelo.add(disp);
            }

            // 5. CONSTRUCCIÓN DEL SELLO DE METATRÓN 3D EN EL SUELO
            construirSelloMetatron(world);

            // 6. CONSTRUCCIÓN DE LA ESFERA DEL SOL DE LA AURORA (18 LOSAS ROTATORIAS)
            construirSolAurora(world);

        } catch (Exception ex) {
            plugin.getLogger().warning("MiniLiveArcangel: Error al instanciar displays: " + ex.getMessage());
            apagar();
            return false;
        }

        // 7. BUCLE CINEMÁTICO PRINCIPAL (60 FPS CLIENT INTERPOLADO)
        this.task = Bukkit.getScheduler().runTaskTimer(plugin, new Runnable() {
            int tick = 0;
            boolean impactoHecho = false;
            boolean juicioEjecutado = false;
            int totemsEntregados = 0;

            @Override
            public void run() {
                Player p = Bukkit.getPlayer(targetUUID);
                if (p == null || !p.isOnline() || displaysModelo.isEmpty()) {
                    apagar();
                    return;
                }

                tick += 2;

                // =============================================================
                // FASE 1: DESCENSO SUPERSÓNICO (Ticks 0 a 34)
                // =============================================================
                if (tick < 34) {
                    float u = (float) tick / 34.0f;
                    float subida = 110.0f * (1.0f - u * u);
                    Arcangel.Pose poseActual = Arcangel.CAYENDO.copia();
                    poseActual.subidaY = subida;
                    poseActual.ofanimSpin = tick * 0.12f;

                    actualizarModelo(poseActual, tick);

                    Location puntoCaida = ancla.clone().add(0, subida + 12.0, 0);
                    apuntarJugador(p, puntoCaida);

                    if (tick == 2) {
                        world.playSound(p.getLocation(), Sound.ITEM_ELYTRA_FLYING, 3.5f, 0.45f);
                        world.playSound(p.getLocation(), Sound.BLOCK_BEACON_ACTIVATE, 2.5f, 0.5f);
                    }
                    world.playSound(puntoCaida, Sound.ENTITY_PHANTOM_FLAP, 2.0f, 1.4f);

                    for (double h = subida; h < subida + 16.0; h += 3.0) {
                        double ang = tick * 0.4 + (h * 0.25);
                        world.spawnParticle(Particle.END_ROD, ancla.getX() + Math.cos(ang) * 2.2, ancla.getY() + h, ancla.getZ() + Math.sin(ang) * 2.2, 1, 0, 0, 0, 0);
                        world.spawnParticle(Particle.SOUL_FIRE_FLAME, ancla.getX() - Math.cos(ang) * 2.2, ancla.getY() + h, ancla.getZ() - Math.sin(ang) * 2.2, 1, 0, 0, 0, 0);
                    }
                }

                // =============================================================
                // FASE 2: SUPERHERO LANDING & CRÁTER SÍSMICO (Ticks 34 a 58)
                // =============================================================
                else if (tick < 58) {
                    if (!impactoHecho) {
                        impactoHecho = true;

                        world.strikeLightningEffect(ancla);
                        world.spawnParticle(Particle.FLASH, ancla, 12, 2.5, 1.0, 2.5, 0.1);
                        world.spawnParticle(Particle.SONIC_BOOM, ancla.clone().add(0, 0.6, 0), 3, 0, 0, 0, 0);
                        world.spawnParticle(Particle.EXPLOSION_HUGE, ancla, 5, 2.0, 0.6, 2.0, 0.1);
                        world.spawnParticle(Particle.FIREWORKS_SPARK, ancla, 150, 3.0, 2.0, 3.0, 0.4);

                        world.playSound(ancla, Sound.ENTITY_GENERIC_EXPLODE, 3.5f, 0.6f);
                        world.playSound(ancla, Sound.BLOCK_ANVIL_LAND, 3.0f, 0.5f);
                        world.playSound(ancla, Sound.ITEM_TRIDENT_THUNDER, 3.0f, 1.1f);
                        world.playSound(ancla, Sound.ENTITY_LIGHTNING_BOLT_THUNDER, 3.0f, 0.8f);

                        // EYECCIÓN DE 16 LOSAS BALÍSTICAS
                        eyectarLosas(world);
                    }

                    moverTrozos();

                    float prog = (tick - 34) / 24.0f;
                    Arcangel.Pose poseActual = Arcangel.Pose.entre(Arcangel.ATERRIZAJE, Arcangel.ERGUIDO, prog);
                    poseActual.ofanimSpin = tick * 0.12f;
                    actualizarModelo(poseActual, tick);
                    apuntarJugador(p, ancla.clone().add(0, 8.0, 0));
                }

                // =============================================================
                // FASE 3: DESPERTAR, DESPLIEGUE DE ALAS Y SELLO (Ticks 58 a 88)
                // =============================================================
                else if (tick < 88) {
                    moverTrozos();
                    actualizarSello(tick - 58, 30);

                    if (tick % 8 == 0) {
                        world.playSound(ancla, Sound.BLOCK_AMETHYST_BLOCK_CHIME, 2.5f, 1.3f);
                        world.playSound(ancla, Sound.BLOCK_BEACON_AMBIENT, 2.0f, 1.2f);
                    }

                    Arcangel.Pose poseActual = Arcangel.ERGUIDO.copia();
                    poseActual.ofanimSpin = tick * 0.14f;
                    actualizarModelo(poseActual, tick);
                    apuntarJugador(p, ancla.clone().add(0, 14.0, 0));
                }

                // =============================================================
                // FASE 4: ALZADA DE LA ESPADA & CARGA DEL SOL (Ticks 88 a 124)
                // =============================================================
                else if (tick < 124) {
                    moverTrozos();
                    actualizarSello(30, 30);

                    float prog = (tick - 88) / 36.0f;
                    Arcangel.Pose poseActual = Arcangel.Pose.entre(Arcangel.ERGUIDO, Arcangel.ALZA_ESPADA, prog);
                    poseActual.ofanimSpin = tick * 0.16f;
                    actualizarModelo(poseActual, tick);

                    // Orbe del Sol en la mano izquierda y escudo sagrado
                    actualizarSolAurora(tick, prog);

                    if (tick == 96 || tick == 108 || tick == 118) {
                        Location espadaCenit = ancla.clone().add(0, 24.0, 0);
                        world.strikeLightningEffect(espadaCenit);
                        world.playSound(espadaCenit, Sound.ITEM_TRIDENT_THUNDER, 3.0f, 1.3f);
                        world.spawnParticle(Particle.FLASH, espadaCenit, 5);
                    }

                    if (tick % 6 == 0) {
                        world.playSound(ancla, Sound.ENTITY_WARDEN_SONIC_CHARGE, 2.0f, 0.8f + prog * 0.5f);
                        world.playSound(ancla, Sound.BLOCK_AMETHYST_BLOCK_RESONATE, 2.5f, 1.1f);
                    }

                    // Levitación de monstruos hostiles
                    world.getNearbyEntities(ancla, 28.0, 14.0, 28.0).stream()
                            .filter(e -> e instanceof Monster)
                            .forEach(e -> {
                                Monster m = (Monster) e;
                                m.addPotionEffect(new PotionEffect(PotionEffectType.LEVITATION, 35, 1, false, false));
                                world.spawnParticle(Particle.SOUL_FIRE_FLAME, m.getLocation().add(0, 1, 0), 4, 0.2, 0.2, 0.2, 0.02);
                            });

                    apuntarJugador(p, ancla.clone().add(0, 18.0, 0));
                }

                // =============================================================
                // FASE 5: EL JUICIO SUPREMO / TAJO & SUPERNOVA (Ticks 124 a 144)
                // =============================================================
                else if (tick < 144) {
                    if (!juicioEjecutado) {
                        juicioEjecutado = true;
                        reventarSello(world);
                        ocultarSol();

                        Location centroJuicio = ancla.clone().add(0, 2.0, 0);

                        world.strikeLightningEffect(centroJuicio);
                        world.strikeLightningEffect(p.getLocation());
                        world.spawnParticle(Particle.FLASH, centroJuicio, 25, 3.5, 3.5, 3.5, 0.1);
                        world.spawnParticle(Particle.TOTEM, centroJuicio, 500, 7.0, 6.0, 7.0, 0.5);
                        world.spawnParticle(Particle.FIREWORKS_SPARK, centroJuicio, 300, 6.0, 5.0, 6.0, 0.35);

                        // Arco frontal del tajo flamígero
                        for (double ang = -Math.PI / 3.0; ang <= Math.PI / 3.0; ang += Math.PI / 16.0) {
                            double arcX = Math.sin(angelYaw + ang) * 7.5;
                            double arcZ = Math.cos(angelYaw + ang) * 7.5;
                            world.spawnParticle(Particle.FLASH, ancla.getX() + arcX, ancla.getY() + 3.0, ancla.getZ() + arcZ, 1);
                            world.spawnParticle(Particle.SONIC_BOOM, ancla.getX() + arcX, ancla.getY() + 1.2, ancla.getZ() + arcZ, 1, 0, 0, 0, 0);
                        }

                        world.playSound(centroJuicio, Sound.ITEM_TOTEM_USE, 4.0f, 0.85f);
                        world.playSound(centroJuicio, Sound.UI_TOAST_CHALLENGE_COMPLETE, 3.5f, 1.0f);
                        world.playSound(centroJuicio, Sound.ENTITY_GENERIC_EXPLODE, 4.0f, 1.3f);
                        world.playSound(centroJuicio, Sound.ENTITY_PLAYER_LEVELUP, 3.5f, 0.75f);

                        // 10 Anillos concéntricos de Sonic Boom
                        for (double r = 2.0; r <= 28.0; r += 2.8) {
                            for (double ang = 0; ang < Math.PI * 2.0; ang += Math.PI / 10.0) {
                                double ox = Math.cos(ang) * r;
                                double oz = Math.sin(ang) * r;
                                world.spawnParticle(Particle.SONIC_BOOM, centroJuicio.getX() + ox, centroJuicio.getY() + 0.3, centroJuicio.getZ() + oz, 1, 0, 0, 0, 0);
                                world.spawnParticle(Particle.END_ROD, centroJuicio.getX() + ox, centroJuicio.getY() + 0.6, centroJuicio.getZ() + oz, 1, 0, 0.1, 0, 0.04);
                            }
                        }

                        // Aniquilación de hostiles (5,000 daño sagrado)
                        world.getNearbyEntities(centroJuicio, 35.0, 18.0, 35.0).stream()
                                .filter(e -> e instanceof Monster)
                                .forEach(e -> {
                                    Monster m = (Monster) e;
                                    m.damage(5000.0);
                                    world.spawnParticle(Particle.FLASH, m.getLocation(), 2);
                                    world.spawnParticle(Particle.SOUL_FIRE_FLAME, m.getLocation().add(0, 0.5, 0), 40, 0.4, 0.4, 0.4, 0.12);
                                });

                        // Curación y bendiciones al streamer
                        p.setHealth(p.getMaxHealth());
                        p.setFoodLevel(20);
                        p.setSaturation(20f);
                        p.addPotionEffect(new PotionEffect(PotionEffectType.REGENERATION, 600, 3, false, false));
                        p.addPotionEffect(new PotionEffect(PotionEffectType.ABSORPTION, 1200, 4, false, false));
                        p.addPotionEffect(new PotionEffect(PotionEffectType.GLOWING, 400, 0, false, false));
                    }

                    moverTrozos();

                    float prog = (tick - 124) / 20.0f;
                    Arcangel.Pose poseActual = Arcangel.Pose.entre(Arcangel.ALZA_ESPADA, Arcangel.TAJO_JUICIO, prog);
                    poseActual.ofanimSpin = tick * 0.20f;
                    actualizarModelo(poseActual, tick);

                    // Cascada de 20 Tótems de la Inmortalidad (2 por tick)
                    if (totemsEntregados < 20) {
                        totemsEntregados += 2;
                        p.getInventory().addItem(new ItemStack(Material.TOTEM_OF_UNDYING, 2));
                        world.playSound(p.getLocation(), Sound.ENTITY_EXPERIENCE_ORB_PICKUP, 1.5f, 0.6f + (totemsEntregados * 0.05f));
                        world.spawnParticle(Particle.TOTEM, p.getLocation().add(0, 1.2, 0), 25, 0.3, 0.5, 0.3, 0.3);

                        p.sendActionBar(Component.text("✦ TÓTEMS CELESTIALES: ", NamedTextColor.GOLD, TextDecoration.BOLD)
                                .append(Component.text(totemsEntregados + " / 20", NamedTextColor.YELLOW, TextDecoration.BOLD)));
                    }
                }

                // =============================================================
                // FASE 6: ASCENSIÓN Y DESPEDIDA CELESTIAL (Ticks 144 a 174)
                // =============================================================
                else if (tick < 174) {
                    moverTrozos();

                    float prog = (tick - 144) / 30.0f;
                    Arcangel.Pose poseActual = Arcangel.Pose.entre(Arcangel.TAJO_JUICIO, Arcangel.ASCENSION, prog);
                    poseActual.subidaY = prog * 60.0f; // Vuelo hacia el firmamento
                    poseActual.ofanimSpin = tick * 0.24f;
                    actualizarModelo(poseActual, tick);

                    if (tick % 6 == 0) {
                        world.playSound(ancla, Sound.ENTITY_ENDER_DRAGON_FLAP, 2.5f, 0.6f);
                        world.playSound(ancla, Sound.BLOCK_BEACON_DEACTIVATE, 2.0f, 1.2f);
                    }

                    apuntarJugador(p, ancla.clone().add(0, poseActual.subidaY + 16.0, 0));
                }

                // =============================================================
                // FINALIZACIÓN Y CLEANUP LIMPIO (Tick >= 174)
                // =============================================================
                else {
                    try { p.resetPlayerTime(); } catch (Exception ignored) {}

                    p.showTitle(Title.title(
                            Component.text("§6§l✦ BENDICIÓN ALCANZADA ✦"),
                            Component.text("§fEl Serafín de §b" + donador + "§f custodia tu alma"),
                            Title.Times.times(Duration.ofMillis(200), Duration.ofSeconds(4), Duration.ofMillis(400))
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
        for (BlockDisplay s : displaysSello) {
            if (s != null && s.isValid()) s.remove();
        }
        for (BlockDisplay o : displaysSol) {
            if (o != null && o.isValid()) o.remove();
        }
        for (Trozo t : trozos) {
            if (t.display != null && t.display.isValid()) t.display.remove();
        }

        displaysModelo.clear();
        displaysSello.clear();
        lineasSelloForma.clear();
        displaysSol.clear();
        trozos.clear();

        if (activo.getAndSet(false)) {
            if (alTerminar != null) {
                alTerminar.run();
            }
        }
    }

    // =========================================================================
    // ACTUALIZACIÓN DE MATRICES DEL MODELO (CLIENT-SIDE INTERPOLATED)
    // =========================================================================
    private void actualizarModelo(Arcangel.Pose pose, int tick) {
        Matrix4f baseMatrix = new Matrix4f()
                .rotateY(angelYaw)
                .scale(escala);

        for (int i = 0; i < displaysModelo.size() && i < Arcangel.PARTES.size(); i++) {
            BlockDisplay disp = displaysModelo.get(i);
            if (disp == null || !disp.isValid()) continue;

            Arcangel.Parte parte = Arcangel.PARTES.get(i);
            Matrix4f m = new Matrix4f(baseMatrix).mul(Arcangel.matrizFinal(parte, pose, tick));

            disp.setInterpolationDelay(0);
            disp.setInterpolationDuration(1);
            disp.setTransformationMatrix(m);
        }
    }

    // =========================================================================
    // SELLO DE METATRÓN 3D EN EL SUELO (BlockDisplays)
    // =========================================================================
    private void construirSelloMetatron(World world) {
        float r = 7.5f;
        // Hexagrama de Metatrón (2 triángulos equiláteros entrelazados)
        float[][] pts = new float[6][2];
        for (int k = 0; k < 6; k++) {
            double a = (Math.PI / 3.0) * k;
            pts[k][0] = (float) Math.cos(a) * r;
            pts[k][1] = (float) Math.sin(a) * r;
        }

        // Triángulo 1 (0, 2, 4)
        agregarLineaForma(pts[0], pts[2], "GOLD_BLOCK", true);
        agregarLineaForma(pts[2], pts[4], "GOLD_BLOCK", true);
        agregarLineaForma(pts[4], pts[0], "GOLD_BLOCK", true);

        // Triángulo 2 (1, 3, 5)
        agregarLineaForma(pts[1], pts[3], "GOLD_BLOCK", true);
        agregarLineaForma(pts[3], pts[5], "GOLD_BLOCK", true);
        agregarLineaForma(pts[5], pts[1], "GOLD_BLOCK", true);

        // Conexiones internas radiales
        for (int k = 0; k < 6; k++) {
            agregarLineaForma(new float[]{0f, 0f}, pts[k], "SEA_LANTERN", true);
        }

        // Círculo exterior circunscrito (24 segmentos)
        int segs = 24;
        for (int i = 0; i < segs; i++) {
            double a0 = (Math.PI * 2.0 / segs) * i;
            double a1 = (Math.PI * 2.0 / segs) * (i + 1);
            float[] p0 = new float[]{(float) Math.cos(a0) * (r * 1.05f), (float) Math.sin(a0) * (r * 1.05f)};
            float[] p1 = new float[]{(float) Math.cos(a1) * (r * 1.05f), (float) Math.sin(a1) * (r * 1.05f)};
            agregarLineaForma(p0, p1, "OCHRE_FROGLIGHT", true);
        }

        // Instanciar los BlockDisplays del sello
        for (int i = 0; i < lineasSelloForma.size(); i++) {
            float[] datos = lineasSelloForma.get(i);
            Material mat = (datos[4] == 1.0f) ? Material.GOLD_BLOCK : (datos[4] == 2.0f ? Material.SEA_LANTERN : Material.OCHRE_FROGLIGHT);
            BlockDisplay d = world.spawn(ancla, BlockDisplay.class, bd -> {
                bd.setBlock(mat.createBlockData());
                bd.setBrightness(new Display.Brightness(15, 15));
                bd.setViewRange(160f);
                bd.setPersistent(false);
                bd.setInterpolationDelay(0);
                bd.setInterpolationDuration(1);
                bd.setGlowing(true);
                bd.setGlowColorOverride((mat == Material.SEA_LANTERN) ? CIAN : ORO);
                bd.setTransformationMatrix(NADA);
            });
            displaysSello.add(d);
        }
    }

    private void agregarLineaForma(float[] p0, float[] p1, String mat, boolean glow) {
        float tipoMat = mat.equals("GOLD_BLOCK") ? 1.0f : (mat.equals("SEA_LANTERN") ? 2.0f : 3.0f);
        lineasSelloForma.add(new float[]{p0[0], p0[1], p1[0], p1[1], tipoMat});
    }

    private void actualizarSello(int f, int duracionApertura) {
        if (displaysSello.isEmpty()) return;

        float u = Math.min(1.0f, (float) f / (float) duracionApertura);
        float giro = (float) f * 0.008f;
        float grueso = 0.22f;

        for (int i = 0; i < displaysSello.size() && i < lineasSelloForma.size(); i++) {
            BlockDisplay d = displaysSello.get(i);
            if (d == null || !d.isValid()) continue;

            float[] tr = lineasSelloForma.get(i);
            float x0 = tr[0] * u;
            float z0 = tr[1] * u;
            float x1 = tr[2] * u;
            float z1 = tr[3] * u;

            float cx = (x0 + x1) * 0.5f;
            float cz = (z0 + z1) * 0.5f;
            float largo = (float) Math.hypot(x1 - x0, z1 - z0) + grueso * 0.5f;
            float ang = (float) Math.atan2(x1 - x0, z1 - z0);

            Matrix4f m = new Matrix4f()
                    .rotateY(angelYaw + giro)
                    .translate(cx, 0.08f, cz)
                    .rotateY(ang)
                    .scale(grueso, 0.06f, largo)
                    .translate(-0.5f, 0.0f, -0.5f);

            d.setTransformationMatrix(m);
        }
    }

    private void reventarSello(World world) {
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        for (BlockDisplay d : displaysSello) {
            if (d == null || !d.isValid()) continue;
            Vector3f v = new Vector3f(
                    (rnd.nextFloat() - 0.5f) * 0.8f,
                    0.5f + rnd.nextFloat() * 0.6f,
                    (rnd.nextFloat() - 0.5f) * 0.8f
            );
            trozos.add(new Trozo(d, new Vector3f(0f, 0.2f, 0f), v, 0.5f, 25 + rnd.nextInt(10)));
        }
        displaysSello.clear();
        lineasSelloForma.clear();
    }

    // =========================================================================
    // ESFERA DEL SOL DE LA AURORA (LOSAS ROTATORIAS EN LA PALMA)
    // =========================================================================
    private void construirSolAurora(World world) {
        for (int i = 0; i < 18; i++) {
            Material mat = (i % 3 == 0) ? Material.SEA_LANTERN : (i % 2 == 0 ? Material.PEARLESCENT_FROGLIGHT : Material.OCHRE_FROGLIGHT);
            BlockDisplay s = world.spawn(ancla, BlockDisplay.class, bd -> {
                bd.setBlock(mat.createBlockData());
                bd.setBrightness(new Display.Brightness(15, 15));
                bd.setViewRange(160f);
                bd.setPersistent(false);
                bd.setInterpolationDelay(0);
                bd.setInterpolationDuration(1);
                bd.setTransformationMatrix(NADA);
            });
            displaysSol.add(s);
        }
    }

    private void actualizarSolAurora(int tick, float prog) {
        if (displaysSol.isEmpty()) return;

        double latido = Math.sin(tick * 0.45) * 0.35;
        float radio = (float) (1.2 + (prog * 3.4) + latido);

        // Posición en la mano izquierda del Arcángel
        float manoX = 4.2f;
        float manoY = 19.5f;
        float manoZ = 1.4f;

        for (int i = 0; i < displaysSol.size(); i++) {
            BlockDisplay bd = displaysSol.get(i);
            if (bd == null || !bd.isValid()) continue;

            float angY = (float) (i * (Math.PI / 9.0) + (tick * 0.08));
            float angX = (float) (i * 0.35 + (tick * 0.05));

            Matrix4f m = new Matrix4f()
                    .rotateY(angelYaw)
                    .translate(manoX, manoY, manoZ)
                    .rotateY(angY)
                    .rotateX(angX)
                    .scale(radio * 0.85f, 0.18f, radio * 0.85f)
                    .translate(-0.5f, -0.5f, -0.5f);

            bd.setTransformationMatrix(m);
        }
    }

    private void ocultarSol() {
        for (BlockDisplay bd : displaysSol) {
            if (bd != null && bd.isValid()) bd.remove();
        }
        displaysSol.clear();
    }

    // =========================================================================
    // FÍSICA BALÍSTICA DE TROZOS Y DEBRIS
    // =========================================================================
    private void eyectarLosas(World world) {
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        for (int i = 0; i < 16; i++) {
            double ang = (Math.PI * 2.0 / 16.0) * i;
            float vx = (float) (Math.cos(ang) * (0.35 + rnd.nextFloat() * 0.45));
            float vy = (float) (0.60 + rnd.nextFloat() * 0.65);
            float vz = (float) (Math.sin(ang) * (0.35 + rnd.nextFloat() * 0.45));
            Material mat = (i % 3 == 0) ? Material.GOLD_BLOCK : (i % 2 == 0 ? Material.SMOOTH_QUARTZ : Material.RAW_GOLD_BLOCK);

            BlockDisplay bd = world.spawn(ancla, BlockDisplay.class, d -> {
                d.setBlock(mat.createBlockData());
                d.setBrightness(new Display.Brightness(15, 15));
                d.setViewRange(160f);
                d.setPersistent(false);
                d.setInterpolationDelay(0);
                d.setInterpolationDuration(1);
            });
            trozos.add(new Trozo(bd, new Vector3f(0f, 0.4f, 0f), new Vector3f(vx, vy, vz), 0.7f, 35));
        }
    }

    private void moverTrozos() {
        Iterator<Trozo> it = trozos.iterator();
        while (it.hasNext()) {
            Trozo z = it.next();
            z.edad++;
            if (z.edad > z.vida || z.display.isDead()) {
                if (!z.display.isDead()) z.display.remove();
                it.remove();
                continue;
            }

            z.vel.y -= 0.045f; // Gravedad
            z.pos.add(z.vel);
            float k = Math.max(0.001f, 1.0f - (float) z.edad / (float) z.vida);

            Matrix4f m = new Matrix4f()
                    .rotateY(angelYaw)
                    .translate(z.pos.x, z.pos.y, z.pos.z)
                    .rotateY(z.edad * 0.25f)
                    .rotateX(z.edad * 0.18f)
                    .scale(z.tam * k, z.tam * k * 0.6f, z.tam * k)
                    .translate(-0.5f, -0.5f, -0.5f);

            z.display.setTransformationMatrix(m);
        }
    }

    // =========================================================================
    // UTILIDADES DE CÁMARA Y ENTORNO
    // =========================================================================
    private static double encontrarSuelo(Location l) {
        World w = l.getWorld();
        if (w == null) return l.getY();
        int x = l.getBlockX();
        int z = l.getBlockZ();
        int startY = Math.min(w.getMaxHeight() - 1, l.getBlockY() + 6);
        for (int y = startY; y > l.getBlockY() - 12; y--) {
            Material m = w.getBlockAt(x, y, z).getType();
            if (m.isSolid() && !m.name().endsWith("LEAVES")) {
                return y + 1.0;
            }
        }
        return l.getY();
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
