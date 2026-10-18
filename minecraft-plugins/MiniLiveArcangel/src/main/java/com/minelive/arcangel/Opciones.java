package com.minelive.arcangel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer;

public final class Opciones {
    private static final LegacyComponentSerializer COLORES = LegacyComponentSerializer.legacyAmpersand();
    private final Map<String, String> valores = new HashMap<>();
    public String donador = "TikTok";
    public final List<String> avisos = new ArrayList<>();

    private Opciones() {}

    public static Opciones leer(String[] args, int desde, Set<String> claves) {
        Opciones o = new Opciones();
        StringBuilder sb = new StringBuilder();
        for (int i = desde; i < args.length; ++i) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(args[i]);
        }
        boolean donadorLeido = false;
        for (String token : tokens(sb.toString())) {
            int igual = token.indexOf('=');
            if (igual <= 0) {
                if (!donadorLeido && !token.isBlank()) {
                    o.donador = token;
                    donadorLeido = true;
                    continue;
                }
                o.avisos.add("Texto ignorado: " + token);
                continue;
            }
            String clave = token.substring(0, igual).toLowerCase(Locale.ROOT);
            if (!claves.contains(clave)) {
                o.avisos.add("Opcion desconocida: " + clave);
                continue;
            }
            o.valores.put(clave, token.substring(igual + 1));
        }
        return o;
    }

    private static List<String> tokens(String s) {
        List<String> out = new ArrayList<>();
        StringBuilder actual = new StringBuilder();
        boolean enComillas = false;
        for (int i = 0; i < s.length(); ++i) {
            char c = s.charAt(i);
            if (c == '"') {
                enComillas = !enComillas;
                continue;
            }
            if (c == ' ' && !enComillas) {
                if (actual.length() > 0) {
                    out.add(actual.toString());
                    actual.setLength(0);
                }
                continue;
            }
            actual.append(c);
        }
        if (actual.length() > 0) {
            out.add(actual.toString());
        }
        return out;
    }

    public boolean tiene(String clave) {
        return valores.containsKey(clave);
    }

    public double numero(String clave, double defecto, double min, double max) {
        String valor = valores.get(clave);
        if (valor == null) return defecto;
        try {
            double v = Double.parseDouble(valor.replace(',', '.'));
            if (Double.isNaN(v) || Double.isInfinite(v)) return defecto;
            return Math.max(min, Math.min(max, v));
        } catch (NumberFormatException e) {
            return defecto;
        }
    }

    public int entero(String clave, int defecto, int min, int max) {
        return (int) Math.round(numero(clave, defecto, min, max));
    }

    public String texto(String clave, String defecto) {
        return valores.getOrDefault(clave, defecto);
    }

    public Component componente(String plantilla, String jugador) {
        String res = plantilla.replace("{jugador}", jugador)
                .replace("{target}", jugador)
                .replace("{donador}", donador)
                .replace("{donor}", donador);
        return COLORES.deserialize(res);
    }
}
