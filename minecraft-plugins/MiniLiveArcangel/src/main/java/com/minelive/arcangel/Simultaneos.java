package com.minelive.arcangel;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public final class Simultaneos<T> {
    private final List<T> activos = new ArrayList<>();
    private final Deque<Runnable> esperando = new ArrayDeque<>();
    private final Function<Runnable, T> fabrica;
    private final Consumer<T> apagar;

    public Simultaneos(Function<Runnable, T> fabrica, Consumer<T> apagar) {
        this.fabrica = fabrica;
        this.apagar = apagar;
    }

    public synchronized Resultado lanzar(int max, Predicate<T> lanzador) {
        if (max > 0 && activos.size() >= max) {
            if (esperando.size() >= 100) {
                return Resultado.DESCARTADO;
            }
            esperando.add(() -> lanzar(max, lanzador));
            return Resultado.EN_ESPERA;
        }
        AtomicReference<T> caja = new AtomicReference<>();
        T show = fabrica.apply(() -> termino(caja.get()));
        caja.set(show);
        activos.add(show);
        if (!lanzador.test(show)) {
            activos.remove(show);
            return Resultado.FALLO;
        }
        return Resultado.LANZADO;
    }

    private synchronized void termino(T show) {
        if (!activos.remove(show)) {
            return;
        }
        Runnable siguiente = esperando.poll();
        if (siguiente != null) {
            siguiente.run();
        }
    }

    public synchronized void apagarTodos() {
        esperando.clear();
        for (T show : List.copyOf(activos)) {
            apagar.accept(show);
        }
        activos.clear();
    }

    public enum Resultado {
        LANZADO,
        EN_ESPERA,
        DESCARTADO,
        FALLO
    }
}
