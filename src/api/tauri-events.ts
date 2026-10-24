import { useEffect, useRef } from 'react';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

/**
 * Hook seguro para suscripción a eventos de Tauri v2 en React 19.
 * Diseñado específicamente para evitar fugas de memoria y listeners huérfanos
 * ante el doble montaje/desmontaje de StrictMode en desarrollo.
 */
export function useTauriEvent<T>(
  eventName: string,
  handler: (payload: T) => void
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    let isMounted = true;
    let unlistenFn: UnlistenFn | undefined;

    listen<T>(eventName, (event) => {
      if (isMounted) {
        handlerRef.current(event.payload);
      }
    })
      .then((unlisten) => {
        if (!isMounted) {
          // Si el componente se desmontó antes de resolver la promesa,
          // destruimos el listener de inmediato para evitar duplicados.
          unlisten();
        } else {
          unlistenFn = unlisten;
        }
      })
      .catch((err) => {
        console.warn(`[TauriEvent] Error registrando listener para "${eventName}":`, err);
      });

    return () => {
      isMounted = false;
      if (unlistenFn) {
        unlistenFn();
      }
    };
  }, [eventName]);
}
