/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  net.kyori.adventure.text.Component
 *  net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer
 */
package com.minelive.atomica;

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
    private final Map<String, String> valores = new HashMap<String, String>();
    public String donador = "Alguien";
    public final List<String> avisos = new ArrayList<String>();

    private Opciones() {
    }

    public static Opciones leer(String[] args, int desde, Set<String> claves) {
        Opciones o = new Opciones();
        StringBuilder sb = new StringBuilder();
        for (int i = desde; i < args.length; ++i) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(args[i]);
        }
        boolean donadorLeido = false;
        for (String token : Opciones.tokens(sb.toString())) {
            int igual = token.indexOf(61);
            if (igual <= 0) {
                if (!donadorLeido && !token.isBlank()) {
                    o.donador = token;
                    donadorLeido = true;
                    continue;
                }
                o.avisos.add("Texto suelto ignorado: " + token);
                continue;
            }
            String clave = token.substring(0, igual).toLowerCase(Locale.ROOT);
            if (!claves.contains(clave)) {
                o.avisos.add("Opci\u00f3n desconocida: " + clave);
                continue;
            }
            o.valores.put(clave, token.substring(igual + 1));
        }
        return o;
    }

    private static List<String> tokens(String s) {
        ArrayList<String> out = new ArrayList<String>();
        StringBuilder actual = new StringBuilder();
        boolean enComillas = false;
        for (int i = 0; i < s.length(); ++i) {
            char c = s.charAt(i);
            if (c == '\"') {
                enComillas = !enComillas;
                continue;
            }
            if (c == ' ' && !enComillas) {
                if (actual.length() <= 0) continue;
                out.add(actual.toString());
                actual.setLength(0);
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
        return this.valores.containsKey(clave);
    }

    public double numero(String clave, double defecto, double min, double max) {
        String valor = this.valores.get(clave);
        if (valor == null) {
            return defecto;
        }
        try {
            double v = Double.parseDouble(valor.replace(',', '.'));
            if (Double.isNaN(v) || Double.isInfinite(v)) {
                throw new NumberFormatException();
            }
            double limitado = Math.max(min, Math.min(max, v));
            if (limitado != v) {
                this.avisos.add(clave + " fuera de rango (" + min + "\u2013" + max + "), se usa " + limitado);
            }
            return limitado;
        }
        catch (NumberFormatException e) {
            this.avisos.add(clave + " no es un n\u00famero: " + valor + ", se usa " + defecto);
            return defecto;
        }
    }

    public int entero(String clave, int defecto, int min, int max) {
        return (int)Math.round(this.numero(clave, defecto, min, max));
    }

    public String texto(String clave, String defecto) {
        String valor = this.valores.get(clave);
        return valor == null ? defecto : valor;
    }

    public Component componente(String plantilla, String jugador) {
        String t = plantilla.replace("{donador}", this.donador).replace("{jugador}", jugador);
        return COLORES.deserialize(t);
    }
}

