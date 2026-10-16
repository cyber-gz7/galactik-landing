package com.gz7.ruletabm;

import com.gz7.ruletabm.buenos.*;
import com.gz7.ruletabm.malos.*;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class GiftRegistry {

    public record GiftEntry(
            String id,
            String displayName,
            int coins,
            GameState.Faction faction,
            GiftHandler handler
    ) {}

    private final Map<String, GiftEntry> gifts = new LinkedHashMap<>();
    private final Map<String, String> aliasMap = new LinkedHashMap<>();

    public GiftRegistry() {
        registerDefaults();
    }

    private void registerDefaults() {
        // MALOS
        register(new GiftEntry("rosa_oscura", "Rosa Oscura", 1, GameState.Faction.MALOS, new RosaOscura()), "niebla", "rosa_mala");
        register(new GiftEntry("gg_maldicion", "Maldición GG", 5, GameState.Faction.MALOS, new GGMaldicion()), "gg_malo", "desastre");
        register(new GiftEntry("hackai_lluvia", "Lluvia Ácida", 15, GameState.Faction.MALOS, new HackaiLluvia()), "hackai_malo", "lluvia_acida");
        register(new GiftEntry("carrusel_infierno", "Carrusel del Infierno", 20, GameState.Faction.MALOS, new CarruselInfierno()), "carrusel_malo", "infierno");
        register(new GiftEntry("dragon_invocacion", "Invocación de Dragón", 50, GameState.Faction.MALOS, new DragonInvocacion()), "dragon", "aliento_dragon");
        register(new GiftEntry("la_parka", "La Parka (Instakill)", 99, GameState.Faction.MALOS, new LaParka()), "parka", "muerte", "instakill_malo");
        register(new GiftEntry("sol_cruel", "Sol Cruel (Mega Instakill)", 199, GameState.Faction.MALOS, new SolCruel()), "sol", "solcruel", "megakill");

        // BUENOS
        register(new GiftEntry("rosa_luz", "Rosa de Luz", 1, GameState.Faction.BUENOS, new RosaLuz()), "escudo_luz", "rosa_buena");
        register(new GiftEntry("gg_bendicion", "Bendición GG", 5, GameState.Faction.BUENOS, new GGBendicion()), "gg_bueno", "bendicion");
        register(new GiftEntry("hackai_sagrado", "Lluvia Sagrada", 15, GameState.Faction.BUENOS, new HackaiSagrado()), "hackai_bueno", "lluvia_sagrada");
        register(new GiftEntry("carrusel_totems", "Tótem Masivo", 20, GameState.Faction.BUENOS, new CarruselTotems()), "carrusel_bueno", "totem_masivo");
        register(new GiftEntry("fenix_renaciente", "Fénix Renaciente", 50, GameState.Faction.BUENOS, new FenixRenaciente()), "fenix", "renaciente");
        register(new GiftEntry("arcangel_serafin", "Arcángel Serafín (Instasave)", 99, GameState.Faction.BUENOS, new ArcangelSerafin()), "arcangel", "serafin", "instasave_bueno");
        register(new GiftEntry("deidad_solar", "Deidad Solar (Mega Save)", 199, GameState.Faction.BUENOS, new DeidadSolar()), "deidad", "deidadsolar", "megasave");
    }

    public void register(GiftEntry entry, String... aliases) {
        gifts.put(entry.id().toLowerCase(), entry);
        aliasMap.put(entry.id().toLowerCase(), entry.id().toLowerCase());
        for (String alias : aliases) {
            aliasMap.put(alias.toLowerCase(), entry.id().toLowerCase());
        }
    }

    public GiftEntry findGift(String query) {
        if (query == null) return null;
        String normalized = query.trim().toLowerCase();
        String primaryId = aliasMap.get(normalized);
        if (primaryId != null) {
            return gifts.get(primaryId);
        }
        return gifts.get(normalized);
    }

    public Collection<GiftEntry> getAllGifts() {
        return Collections.unmodifiableCollection(gifts.values());
    }
}
