-- =============================================================================
-- GALACTIC LIVE (GZ7) — ESQUEMA DE LICENCIAS, HWID Y AUTORIZACIÓN DE PLUGINS MC
-- 100% Compatible con Supabase Free Tier ($0/mes)
-- Seguridad: Row Level Security (RLS) estricto + Funciones RPC SECURITY DEFINER
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.streamers_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'STREAMER' CHECK (role IN ('ADMIN', 'STREAMER')),
    license_key TEXT NOT NULL UNIQUE,
    bound_hwid TEXT NOT NULL DEFAULT '*',
    allow_mc_plugins BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT NOT NULL DEFAULT '',
    expires_at TIMESTAMPTZ NOT NULL,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_streamers_licenses_username ON public.streamers_licenses (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_streamers_licenses_hwid ON public.streamers_licenses (bound_hwid);

ALTER TABLE public.streamers_licenses ENABLE ROW LEVEL SECURITY;

-- Ningún cliente externo con la anon_key puede hacer SELECT/INSERT/UPDATE/DELETE directo a la tabla
REVOKE ALL ON public.streamers_licenses FROM anon, authenticated;

-- Función RPC segura invocada por el binario compilado en Rust (Galactic Live)
CREATE OR REPLACE FUNCTION public.verify_and_bind_streamer(
    p_username TEXT,
    p_hwid TEXT,
    p_license_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_rec public.streamers_licenses%ROWTYPE;
BEGIN
    SELECT * INTO v_rec
    FROM public.streamers_licenses
    WHERE LOWER(username) = LOWER(TRIM(p_username))
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'verified', FALSE,
            'error', 'Cuenta de streamer no registrada en el servidor central de GZ7.'
        );
    END IF;

    IF NOT v_rec.is_active THEN
        RETURN jsonb_build_object(
            'verified', FALSE,
            'error', 'Tu licencia ha sido suspendida temporalmente por el administrador (GZ7).'
        );
    END IF;

    IF v_rec.expires_at < NOW() THEN
        RETURN jsonb_build_object(
            'verified', FALSE,
            'error', 'Tu periodo de prueba ha expirado. Solicita renovación a GZ7.'
        );
    END IF;

    -- Si se provee clave de licencia, validar que coincida
    IF TRIM(p_license_key) <> '' AND TRIM(v_rec.license_key) <> TRIM(p_license_key) THEN
        RETURN jsonb_build_object(
            'verified', FALSE,
            'error', 'La clave de activación ingresada no coincide con esta cuenta de streamer.'
        );
    END IF;

    -- Si la licencia aún no tenía HWID asignado ('*'), se ata automáticamente a la primera PC del streamer
    IF v_rec.bound_hwid = '*' OR v_rec.bound_hwid = '' THEN
        UPDATE public.streamers_licenses
        SET bound_hwid = TRIM(p_hwid),
            last_seen_at = NOW(),
            updated_at = NOW()
        WHERE id = v_rec.id;
        v_rec.bound_hwid := TRIM(p_hwid);
    ELSIF v_rec.bound_hwid <> TRIM(p_hwid) THEN
        RETURN jsonb_build_object(
            'verified', FALSE,
            'error', format('Esta licencia ya está vinculada a otro equipo (%s). Solicita un reset de HWID a GZ7.', v_rec.bound_hwid)
        );
    ELSE
        UPDATE public.streamers_licenses
        SET last_seen_at = NOW()
        WHERE id = v_rec.id;
    END IF;

    RETURN jsonb_build_object(
        'verified', TRUE,
        'username', v_rec.username,
        'role', v_rec.role,
        'bound_hwid', v_rec.bound_hwid,
        'allow_mc_plugins', v_rec.allow_mc_plugins,
        'expires_at', EXTRACT(EPOCH FROM v_rec.expires_at)::BIGINT
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_and_bind_streamer(TEXT, TEXT, TEXT) TO anon, authenticated;

-- =============================================================================
-- Función RPC: Registro directo / Solicitud de prueba de Streamer
-- Permite a un streamer de Galactik solicitar o iniciar una prueba de 7 días
-- =============================================================================
CREATE OR REPLACE FUNCTION public.register_streamer_request(
    p_username TEXT,
    p_hwid TEXT,
    p_notes TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_user TEXT;
    v_rec public.streamers_licenses%ROWTYPE;
    v_gen_key TEXT;
BEGIN
    v_clean_user := LOWER(TRIM(p_username));
    IF LENGTH(v_clean_user) < 3 THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', 'El nombre de usuario debe tener al menos 3 caracteres.'
        );
    END IF;

    SELECT * INTO v_rec
    FROM public.streamers_licenses
    WHERE LOWER(username) = v_clean_user
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', TRUE,
            'is_existing', TRUE,
            'message', 'Usuario ya registrado. Inicia sesión con tu clave o solicita reactivación.',
            'license_key', v_rec.license_key,
            'is_active', v_rec.is_active,
            'expires_at', EXTRACT(EPOCH FROM v_rec.expires_at)::BIGINT
        );
    END IF;

    -- Generar clave única formato GLK-XXXX-XXXX
    v_gen_key := 'GLK-' || UPPER(SUBSTRING(encode(gen_random_bytes(6), 'hex') FROM 1 FOR 4)) || '-' || UPPER(SUBSTRING(encode(gen_random_bytes(6), 'hex') FROM 5 FOR 4));

    -- Insertar nuevo streamer con 7 días de prueba y HWID atado
    INSERT INTO public.streamers_licenses (
        username,
        role,
        license_key,
        bound_hwid,
        allow_mc_plugins,
        is_active,
        notes,
        expires_at
    ) VALUES (
        v_clean_user,
        'STREAMER',
        v_gen_key,
        TRIM(p_hwid),
        FALSE,
        TRUE,
        COALESCE(p_notes, 'Auto-registro Galactik'),
        NOW() + INTERVAL '7 days'
    ) RETURNING * INTO v_rec;

    RETURN jsonb_build_object(
        'success', TRUE,
        'is_existing', FALSE,
        'message', '¡Registro exitoso! Disfrutas de 7 días de prueba con tu HWID vinculado.',
        'license_key', v_rec.license_key,
        'username', v_rec.username,
        'expires_at', EXTRACT(EPOCH FROM v_rec.expires_at)::BIGINT
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_streamer_request(TEXT, TEXT, TEXT) TO anon, authenticated;

