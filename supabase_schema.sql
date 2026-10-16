-- ==============================================================================
-- GALACTIC LIVE — ESQUEMA DE BASE DE DATOS Y GESTIÓN DE LICENCIAS (SUPABASE)
-- Ejecuta este script completo en el SQL Editor de tu panel de Supabase:
-- https://supabase.com/dashboard/project/dcsxkcextfdabuewfvek/sql/new
-- ==============================================================================

-- 1. CREACIÓN DE LA TABLA PÚBLICA DE STREAMERS
CREATE TABLE IF NOT EXISTS public.streamers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    tiktok_username TEXT DEFAULT '',
    hwid TEXT,
    role TEXT NOT NULL DEFAULT 'STREAMER', -- 'ADMIN' | 'STREAMER'
    is_active BOOLEAN NOT NULL DEFAULT true, -- Control de licencia: true = activa, false = suspendida
    allow_mc_plugins BOOLEAN NOT NULL DEFAULT true, -- Permiso de Minecraft/RCON
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para búsquedas ultra rápidas
CREATE INDEX IF NOT EXISTS idx_streamers_email ON public.streamers(email);
CREATE INDEX IF NOT EXISTS idx_streamers_tiktok ON public.streamers(tiktok_username);
CREATE INDEX IF NOT EXISTS idx_streamers_hwid ON public.streamers(hwid);

-- 2. FUNCIÓN Y TRIGGER AUTOMÁTICO AL REGISTRARSE UN USUARIO EN SUPABASE AUTH
-- Cada vez que un streamer se registra (en la landing o en el exe), se crea su fila en public.streamers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.streamers (id, email, tiktok_username, is_active, role, allow_mc_plugins)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'tiktok_username', ''),
        true,
        COALESCE(NEW.raw_user_meta_data->>'role', 'STREAMER'),
        true
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        tiktok_username = COALESCE(NULLIF(EXCLUDED.tiktok_username, ''), public.streamers.tiktok_username),
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MIGRAR USUARIOS QUE YA SE HAYAN REGISTRADO ANTERIORMENTE
INSERT INTO public.streamers (id, email, tiktok_username, is_active, role, allow_mc_plugins)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'tiktok_username', ''), 
    true, 
    'STREAMER', 
    true
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. FUNCIÓN RPC: BIND DE HWID AL INICIAR SESIÓN DESDE LA APP DE ESCRITORIO
CREATE OR REPLACE FUNCTION public.bind_hwid_on_login(
    p_user_id TEXT,
    p_hwid TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID;
    v_record RECORD;
BEGIN
    BEGIN
        v_uid := p_user_id::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_uid := auth.uid();
    END;

    -- Si el streamer ya tiene un HWID guardado se mantiene, si está vacío se vincula a este PC
    UPDATE public.streamers
    SET 
        hwid = COALESCE(NULLIF(hwid, ''), p_hwid),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_uid
    RETURNING is_active, role, allow_mc_plugins, hwid INTO v_record;

    IF NOT FOUND THEN
        INSERT INTO public.streamers (id, email, hwid, role, is_active, allow_mc_plugins)
        VALUES (
            v_uid,
            COALESCE((SELECT email FROM auth.users WHERE id = v_uid), 'streamer@galactic.live'),
            p_hwid,
            'STREAMER',
            true,
            true
        )
        RETURNING is_active, role, allow_mc_plugins, hwid INTO v_record;
    END IF;

    RETURN jsonb_build_object(
        'is_active', v_record.is_active,
        'role', v_record.role,
        'allow_mc_plugins', v_record.allow_mc_plugins,
        'hwid', v_record.hwid
    );
END;
$$;

-- 5. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
ALTER TABLE public.streamers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Streamers can view own profile" ON public.streamers;
CREATE POLICY "Streamers can view own profile"
    ON public.streamers
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Streamers can update own profile" ON public.streamers;
CREATE POLICY "Streamers can update own profile"
    ON public.streamers
    FOR UPDATE
    USING (auth.uid() = id);

-- Acceso completo para el service_role (Panel de Supabase / Admin)
DROP POLICY IF EXISTS "Service role full access" ON public.streamers;
CREATE POLICY "Service role full access"
    ON public.streamers
    FOR ALL
    USING (true);

-- Permisos de ejecución y acceso
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.streamers TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.bind_hwid_on_login(TEXT, TEXT) TO anon, authenticated, service_role;
