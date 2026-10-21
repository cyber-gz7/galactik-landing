package com.gz7.ruletabm;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.event.player.PlayerRespawnEvent;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class BuenosMalosMain extends JavaPlugin implements CommandExecutor, TabCompleter, Listener {

    private GameState gameState;
    private TotemManager totemManager;
    private GiftRegistry giftRegistry;

    @Override
    public void onEnable() {
        this.gameState = new GameState();
        this.totemManager = new TotemManager(this, gameState);
        this.giftRegistry = new GiftRegistry();

        if (getCommand("bm") != null) {
            getCommand("bm").setExecutor(this);
            getCommand("bm").setTabCompleter(this);
        }

        if (getCommand("arcangel") != null) {
            getCommand("arcangel").setExecutor(this);
            getCommand("arcangel").setTabCompleter(this);
        }

        Bukkit.getPluginManager().registerEvents(this, this);

        Player firstOnline = Bukkit.getOnlinePlayers().stream().findFirst().orElse(null);
        if (firstOnline != null) {
            gameState.setActivePlayer(firstOnline);
        }

        getLogger().info("BuenosMalosPlugin 1.0.0 cargado con exito para Spigot 1.20.1.");
    }

    @Override
    public void onDisable() {
        if (totemManager != null) {
            totemManager.cleanup();
        }
        getLogger().info("BuenosMalosPlugin deshabilitado limpiamente.");
    }

    public GameState getGameState() {
        return gameState;
    }

    public TotemManager getTotemManager() {
        return totemManager;
    }

    public GiftRegistry getGiftRegistry() {
        return giftRegistry;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            sendHelp(sender);
            return true;
        }

        String sub = args[0].toLowerCase();
        switch (sub) {
            case "totem":
                handleTotemCommand(sender, args);
                break;
            case "gift":
                handleGiftCommand(sender, args);
                break;
            case "target":
                handleTargetCommand(sender, args);
                break;
            case "reset":
                handleResetCommand(sender);
                break;
            case "list":
                handleListCommand(sender);
                break;
            default:
                sendHelp(sender);
                break;
        }
        return true;
    }

    private void handleTotemCommand(CommandSender sender, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Uso: /bm totem <cantidad>");
            return;
        }
        try {
            int amount = Integer.parseInt(args[1]);
            totemManager.setTotems(amount);
            sender.sendMessage(ChatColor.GREEN + "Tótems establecidos a: " + ChatColor.YELLOW + gameState.getCurrentTotems());
        } catch (NumberFormatException e) {
            sender.sendMessage(ChatColor.RED + "Cantidad inválida. Debe ser un número entero.");
        }
    }

    private void handleGiftCommand(CommandSender sender, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(ChatColor.RED + "Uso: /bm gift <nombre_gift> [target] [donador]");
            return;
        }

        String giftName = args[1];
        GiftRegistry.GiftEntry entry = giftRegistry.findGift(giftName);
        if (entry == null) {
            sender.sendMessage(ChatColor.RED + "Regalo no encontrado: '" + giftName + "'. Usa /bm list para ver los disponibles.");
            return;
        }

        Player target = null;
        String donador = "TikToker";

        if (args.length >= 4) {
            Player explicitTarget = Bukkit.getPlayer(args[2]);
            if (explicitTarget != null && explicitTarget.isOnline()) {
                target = explicitTarget;
                donador = String.join(" ", Arrays.copyOfRange(args, 3, args.length)).replace("\"", "");
            } else {
                donador = args[2].replace("\"", "");
            }
        } else if (args.length == 3) {
            Player explicitTarget = Bukkit.getPlayer(args[2]);
            if (explicitTarget != null && explicitTarget.isOnline()) {
                target = explicitTarget;
            } else {
                donador = args[2].replace("\"", "");
            }
        }

        if (target == null) {
            target = resolveTargetPlayer(sender);
        }

        if (target == null) {
            sender.sendMessage(ChatColor.RED + "No hay jugador objetivo activo en el servidor.");
            return;
        }

        entry.handler().execute(target, donador, this);
        sender.sendMessage(ChatColor.GREEN + "Ejecutando '" + entry.displayName() + "' de " + donador + " sobre " + target.getName());
    }

    private void handleTargetCommand(CommandSender sender, String[] args) {
        if (args.length < 2) {
            Player current = gameState.getActivePlayer();
            sender.sendMessage(ChatColor.GOLD + "Jugador objetivo actual: " + (current != null ? current.getName() : "Ninguno"));
            return;
        }
        Player target = Bukkit.getPlayer(args[1]);
        if (target == null) {
            sender.sendMessage(ChatColor.RED + "Jugador no encontrado: " + args[1]);
            return;
        }
        gameState.setActivePlayer(target);
        sender.sendMessage(ChatColor.GREEN + "Jugador objetivo establecido a: " + ChatColor.YELLOW + target.getName());
    }

    private void handleResetCommand(CommandSender sender) {
        gameState.setTotems(10);
        gameState.setImmunitySeconds(0);
        gameState.setCinematicLock(false);
        totemManager.updateHudDisplays();
        sender.sendMessage(ChatColor.GREEN + "Estado de juego reiniciado: 10 tótems, sin inmunidad.");
    }

    private void handleListCommand(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== CATÁLOGO DE REGALOS BUENOS vs MALOS ===");
        sender.sendMessage(ChatColor.RED + "" + ChatColor.BOLD + "[MALOS]:");
        giftRegistry.getAllGifts().stream()
                .filter(g -> g.faction() == GameState.Faction.MALOS)
                .forEach(g -> sender.sendMessage(ChatColor.GRAY + " - " + ChatColor.RED + g.id()
                        + ChatColor.DARK_GRAY + " (" + g.coins() + " coins): " + ChatColor.WHITE + g.displayName()));

        sender.sendMessage(ChatColor.AQUA + "" + ChatColor.BOLD + "[BUENOS]:");
        giftRegistry.getAllGifts().stream()
                .filter(g -> g.faction() == GameState.Faction.BUENOS)
                .forEach(g -> sender.sendMessage(ChatColor.GRAY + " - " + ChatColor.AQUA + g.id()
                        + ChatColor.DARK_GRAY + " (" + g.coins() + " coins): " + ChatColor.WHITE + g.displayName()));
    }

    private Player resolveTargetPlayer(CommandSender sender) {
        Player target = gameState.getActivePlayer();
        if (target == null || !target.isOnline()) {
            if (sender instanceof Player playerSender) {
                target = playerSender;
                gameState.setActivePlayer(playerSender);
            } else {
                target = Bukkit.getOnlinePlayers().stream().findFirst().orElse(null);
                if (target != null) {
                    gameState.setActivePlayer(target);
                }
            }
        }
        return target;
    }

    private void sendHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== COMANDOS BUENOS vs MALOS ===");
        sender.sendMessage(ChatColor.YELLOW + "/bm totem <cantidad> " + ChatColor.GRAY + "- Define la cantidad de tótems (0-20)");
        sender.sendMessage(ChatColor.YELLOW + "/bm gift <nombre> [donador] " + ChatColor.GRAY + "- Simula la recepción de un regalo");
        sender.sendMessage(ChatColor.YELLOW + "/bm target [jugador] " + ChatColor.GRAY + "- Define o consulta el jugador objetivo");
        sender.sendMessage(ChatColor.YELLOW + "/bm reset " + ChatColor.GRAY + "- Reinicia tótems a 10");
        sender.sendMessage(ChatColor.YELLOW + "/bm list " + ChatColor.GRAY + "- Lista todos los regalos configurados");
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length == 1) {
            return Arrays.asList("totem", "gift", "target", "reset", "list").stream()
                    .filter(s -> s.startsWith(args[0].toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (args.length == 2 && args[0].equalsIgnoreCase("gift")) {
            return giftRegistry.getAllGifts().stream()
                    .map(GiftRegistry.GiftEntry::id)
                    .filter(id -> id.startsWith(args[1].toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (args.length == 2 && args[0].equalsIgnoreCase("target")) {
            return Bukkit.getOnlinePlayers().stream()
                    .map(Player::getName)
                    .filter(name -> name.toLowerCase().startsWith(args[1].toLowerCase()))
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        if (gameState.getActivePlayer() == null) {
            gameState.setActivePlayer(event.getPlayer());
        }
        totemManager.updateHudDisplays();
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        if (event.getPlayer().equals(gameState.getActivePlayer())) {
            Player next = Bukkit.getOnlinePlayers().stream()
                    .filter(p -> !p.equals(event.getPlayer()))
                    .findFirst()
                    .orElse(null);
            gameState.setActivePlayer(next);
        }
    }

    @EventHandler
    public void onPlayerRespawn(PlayerRespawnEvent event) {
        Bukkit.getScheduler().runTaskLater(this, () -> totemManager.updateHudDisplays(), 5L);
    }
}
