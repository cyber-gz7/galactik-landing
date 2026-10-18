/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.bukkit.Bukkit
 *  org.bukkit.command.Command
 *  org.bukkit.command.CommandExecutor
 *  org.bukkit.command.CommandSender
 *  org.bukkit.entity.Player
 *  org.bukkit.plugin.java.JavaPlugin
 */
package com.minelive.atomica;

import com.minelive.atomica.AtomicaShow;
import com.minelive.atomica.Opciones;
import com.minelive.atomica.Pase;
import com.minelive.atomica.Simultaneos;
import java.util.Set;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

public final class AtomicaCommand
implements CommandExecutor {
    private static final String USO = "Uso: /atomica <jugador> [donador] [titulo=.. subtitulo=.. chat=.. potencia=.. radio=..]";
    private static final Set<String> CLAVES = Set.of("totems", "max", "titulo", "subtitulo", "chat", "potencia", "radio");
    private final JavaPlugin plugin;
    private final Simultaneos<AtomicaShow> atomicaShow;

    public AtomicaCommand(JavaPlugin plugin, Simultaneos<AtomicaShow> atomicaShow) {
        this.plugin = plugin;
        this.atomicaShow = atomicaShow;
    }

    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!Pase.permitir(sender, command.getName())) {
            return true;
        }
        if (args.length < 1) {
            sender.sendMessage(USO);
            return true;
        }
        Player objetivo = Bukkit.getPlayerExact((String)args[0]);
        if (objetivo == null || !objetivo.isOnline()) {
            this.plugin.getLogger().warning("atomica: el jugador no est\u00e1 online: " + args[0]);
            sender.sendMessage("El jugador no est\u00e1 online: " + args[0]);
            return true;
        }
        Opciones o = Opciones.leer(args, 1, CLAVES);
        for (String aviso : o.avisos) {
            sender.sendMessage("[atomica] " + aviso);
        }
        int max = o.entero("max", 0, 0, 50);
        Simultaneos.Resultado r = this.atomicaShow.lanzar(max, s -> objetivo.isOnline() && s.lanzar(objetivo, o));
        if (r == Simultaneos.Resultado.EN_ESPERA) {
            sender.sendMessage("At\u00f3mica en espera: ya hay " + max + " a la vez.");
        } else if (r == Simultaneos.Resultado.DESCARTADO) {
            sender.sendMessage("At\u00f3mica descartado: demasiados en espera.");
        } else if (r == Simultaneos.Resultado.FALLO) {
            sender.sendMessage("At\u00f3mica no se pudo lanzar.");
        }
        return true;
    }
}

