/*
 * Decompiled with CFR 0.152.
 */
package com.minelive.atomica;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

final class Simultaneos<T> {
    static final int MAX_EN_ESPERA = 100;
    private final List<T> activos = new ArrayList<T>();
    private final Deque<Runnable> esperando = new ArrayDeque<Runnable>();
    private final Function<Runnable, T> fabrica;
    private final Consumer<T> apagar;

    Simultaneos(Function<Runnable, T> fabrica, Consumer<T> apagar) {
        this.fabrica = fabrica;
        this.apagar = apagar;
    }

    Resultado lanzar(int max, Predicate<T> lanzador) {
        if (max > 0 && this.activos.size() >= max) {
            if (this.esperando.size() >= 100) {
                return Resultado.DESCARTADO;
            }
            this.esperando.add(() -> this.lanzar(max, lanzador));
            return Resultado.EN_ESPERA;
        }
        AtomicReference<T> caja = new AtomicReference<T>();
        T show = this.fabrica.apply(() -> this.termino(caja.get()));
        caja.set(show);
        this.activos.add(show);
        if (!lanzador.test(show)) {
            this.activos.remove(show);
            return Resultado.FALLO;
        }
        return Resultado.LANZADO;
    }

    private void termino(T show) {
        if (!this.activos.remove(show)) {
            return;
        }
        Runnable siguiente = this.esperando.poll();
        if (siguiente != null) {
            siguiente.run();
        }
    }

    List<T> activos() {
        return List.copyOf(this.activos);
    }

    int enEspera() {
        return this.esperando.size();
    }

    void apagarTodos() {
        this.esperando.clear();
        for (T show : List.copyOf(this.activos)) {
            this.apagar.accept(show);
        }
        this.activos.clear();
    }

    static enum Resultado {
        LANZADO,
        EN_ESPERA,
        DESCARTADO,
        FALLO;

    }
}

