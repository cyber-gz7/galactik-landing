package com.gz7.ruletabm;

import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

public interface GiftHandler {
    void execute(Player target, String donador, JavaPlugin plugin);
}
