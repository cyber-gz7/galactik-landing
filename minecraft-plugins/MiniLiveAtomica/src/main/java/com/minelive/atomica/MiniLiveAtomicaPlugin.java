/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.bukkit.command.CommandExecutor
 *  org.bukkit.command.PluginCommand
 *  org.bukkit.plugin.Plugin
 *  org.bukkit.plugin.java.JavaPlugin
 */
package com.minelive.atomica;

import com.minelive.atomica.AtomicaCommand;
import com.minelive.atomica.AtomicaShow;
import com.minelive.atomica.Pase;
import com.minelive.atomica.Simultaneos;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.PluginCommand;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

public final class MiniLiveAtomicaPlugin
extends JavaPlugin {
    private Simultaneos<AtomicaShow> atomicaShow;

    public void onEnable() {
        Pase.iniciar(this);
        this.atomicaShow = new Simultaneos<AtomicaShow>(fin -> new AtomicaShow(this, (Runnable)fin), AtomicaShow::apagar);
        PluginCommand comando = this.getCommand("atomica");
        if (comando == null) {
            this.getLogger().severe("No se registr\u00f3 /atomica. Revisa plugin.yml.");
            this.getServer().getPluginManager().disablePlugin((Plugin)this);
            return;
        }
        comando.setExecutor((CommandExecutor)new AtomicaCommand(this, this.atomicaShow));
        this.getLogger().info("MiniLiveAtomica listo. Uso: /atomica <jugador> [donador] [titulo=.. subtitulo=.. chat=.. potencia=.. radio=..]");
    }

    public void onDisable() {
        if (this.atomicaShow != null) {
            this.atomicaShow.apagarTodos();
        }
    }
}

