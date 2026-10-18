package com.minelive.arcangel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

public final class ArcangelCommand implements CommandExecutor, TabCompleter {
    private static final String USO = "Uso: /arcangel <jugador> [donador] [titulo=.. subtitulo=.. chat=.. max=..]";
    private static final Set<String> CLAVES = Set.of("max", "titulo", "subtitulo", "chat");

    private final JavaPlugin plugin;
    private final Simultaneos<ArcangelShow> shows;

    public ArcangelCommand(JavaPlugin plugin, Simultaneos<ArcangelShow> shows) {
        this.plugin = plugin;
        this.shows = shows;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.hasPermission("minelive.arcangel")) {
            sender.sendMessage("§cNo tienes permisos para ejecutar este comando.");
            return true;
        }

        if (args.length < 1) {
            sender.sendMessage(USO);
            return true;
        }

        Player target = Bukkit.getPlayerExact(args[0]);
        if (target == null || !target.isOnline()) {
            sender.sendMessage("§cEl jugador no esta online: " + args[0]);
            return true;
        }

        Opciones opciones = Opciones.leer(args, 1, CLAVES);
        for (String aviso : opciones.avisos) {
            sender.sendMessage("§e[Arcangel] " + aviso);
        }

        int max = opciones.entero("max", 0, 0, 50);
        Simultaneos.Resultado resultado = shows.lanzar(max, show -> target.isOnline() && show.lanzar(target, opciones));

        if (resultado == Simultaneos.Resultado.EN_ESPERA) {
            sender.sendMessage("§eOfanim en espera: ya hay " + max + " a la vez.");
        } else if (resultado == Simultaneos.Resultado.DESCARTADO) {
            sender.sendMessage("§cOfanim descartado: demasiados en espera.");
        } else if (resultado == Simultaneos.Resultado.FALLO) {
            sender.sendMessage("§cNo se pudo invocar el Ofanim.");
        }

        return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length == 1) {
            List<String> matches = new ArrayList<>();
            String prefix = args[0].toLowerCase();
            for (Player p : Bukkit.getOnlinePlayers()) {
                if (p.getName().toLowerCase().startsWith(prefix)) {
                    matches.add(p.getName());
                }
            }
            return matches;
        }
        if (args.length >= 3) {
            List<String> completions = new ArrayList<>();
            String cur = args[args.length - 1].toLowerCase();
            for (String key : CLAVES) {
                String optionPrefix = key + "=";
                if (optionPrefix.startsWith(cur)) {
                    completions.add(optionPrefix);
                }
            }
            return completions;
        }
        return Collections.emptyList();
    }
}
