package com.minelive.arcangel;

import org.bukkit.command.PluginCommand;
import org.bukkit.plugin.java.JavaPlugin;

public final class MiniLiveArcangelPlugin extends JavaPlugin {
    private Simultaneos<ArcangelShow> shows;

    @Override
    public void onEnable() {
        saveDefaultConfig();

        this.shows = new Simultaneos<>(fin -> new ArcangelShow(this, fin), ArcangelShow::apagar);

        PluginCommand command = getCommand("arcangel");
        if (command == null) {
            getLogger().severe("No se pudo registrar el comando /arcangel. Verifica plugin.yml.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }

        ArcangelCommand executor = new ArcangelCommand(this, shows);
        command.setExecutor(executor);
        command.setTabCompleter(executor);

        getLogger().info("MiniLiveArcangel habilitado con exito (Display Entities Paper 1.20.1).");
    }

    @Override
    public void onDisable() {
        if (shows != null) {
            shows.apagarTodos();
        }
        getLogger().info("MiniLiveArcangel deshabilitado. Todas las entidades limpiadas.");
    }
}
