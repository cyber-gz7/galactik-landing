package com.gz7.ruletabm;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;

import java.util.UUID;

public class GameState {

    public enum Faction {
        BUENOS,
        MALOS,
        NEUTRAL
    }

    private static final int MAX_TOTEMS = 20;

    private UUID activePlayerUuid;
    private int currentTotems = 10;
    private Faction activeFaction = Faction.NEUTRAL;
    private long immunityUntilTimestamp = 0L;
    private boolean cinematicLock = false;

    public GameState() {}

    public synchronized void setActivePlayer(Player player) {
        this.activePlayerUuid = player != null ? player.getUniqueId() : null;
    }

    public synchronized Player getActivePlayer() {
        if (activePlayerUuid == null) return null;
        return Bukkit.getPlayer(activePlayerUuid);
    }

    public synchronized UUID getActivePlayerUuid() {
        return activePlayerUuid;
    }

    public synchronized int getCurrentTotems() {
        return currentTotems;
    }

    public synchronized void setTotems(int count) {
        this.currentTotems = Math.max(0, Math.min(MAX_TOTEMS, count));
    }

    public synchronized int addTotems(int delta) {
        this.currentTotems = Math.max(0, Math.min(MAX_TOTEMS, this.currentTotems + delta));
        return this.currentTotems;
    }

    public synchronized int removeTotems(int delta) {
        if (isImmune()) return this.currentTotems;
        this.currentTotems = Math.max(0, this.currentTotems - delta);
        return this.currentTotems;
    }

    public synchronized void setImmunitySeconds(int seconds) {
        this.immunityUntilTimestamp = System.currentTimeMillis() + (seconds * 1000L);
    }

    public synchronized boolean isImmune() {
        return System.currentTimeMillis() < immunityUntilTimestamp;
    }

    public synchronized long getRemainingImmunitySeconds() {
        long remaining = immunityUntilTimestamp - System.currentTimeMillis();
        return remaining > 0 ? (remaining / 1000L) : 0L;
    }

    public synchronized Faction getActiveFaction() {
        return activeFaction;
    }

    public synchronized void setActiveFaction(Faction activeFaction) {
        this.activeFaction = activeFaction;
    }

    public synchronized boolean isCinematicLocked() {
        return cinematicLock;
    }

    public synchronized void setCinematicLock(boolean cinematicLock) {
        this.cinematicLock = cinematicLock;
    }

    public static int getMaxTotems() {
        return MAX_TOTEMS;
    }
}
