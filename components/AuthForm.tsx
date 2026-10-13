'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
  Sparkles,
  Mail,
  Lock,
  AtSign,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const supabase = createClient();

    if (mode === 'register') {
      if (!email.trim() || !password || !confirmPassword || !tiktokUsername.trim()) {
        setErrorMessage('Por favor, completa todos los campos requeridos.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        return;
      }

      // Normalize TikTok username
      const normalizedHandle = tiktokUsername.trim().startsWith('@')
        ? tiktokUsername.trim()
        : `@${tiktokUsername.trim()}`;

      try {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              tiktok_username: normalizedHandle,
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        // If user is returned and session is active, go straight to dashboard
        if (data.session) {
          router.push('/dashboard');
          router.refresh();
          return;
        }

        // If email confirmation is required by Supabase project settings
        if (data.user && !data.session) {
          setSuccessMessage(
            '¡Cuenta creada exitosamente! Revisa tu correo electrónico para confirmar tu cuenta y luego inicia sesión.'
          );
          return;
        }

        router.push('/dashboard');
        router.refresh();
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message || 'Error inesperado durante el registro.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      if (!email.trim() || !password) {
        setErrorMessage('Por favor, ingresa tu email y contraseña.');
        return;
      }

      try {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(
            error.message === 'Invalid login credentials'
              ? 'Credenciales inválidas. Verifica tu email y contraseña.'
              : error.message
          );
          return;
        }

        router.push('/dashboard');
        router.refresh();
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message || 'Error inesperado al iniciar sesión.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container Card */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.15)] backdrop-blur-2xl">
        {/* Top Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00f0ff]/30 to-[#ff2a5f]/30 border border-[#00f0ff]/50 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-transform group-hover:scale-110">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#020409]">
                <Sparkles className="h-6 w-6 text-[#00f0ff]" />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {mode === 'register' ? 'Crear Cuenta de Streamer' : 'Iniciar Sesión'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            {mode === 'register'
              ? 'Conecta tu canal de TikTok Live y vincula tu HWID'
              : 'Accede a tu panel de licencia y descargas de Galactic Live'}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs sm:text-sm text-red-200 backdrop-blur-md">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error de autenticación</p>
              <p className="mt-0.5 opacity-90">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs sm:text-sm text-emerald-200 backdrop-blur-md">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">¡Registro exitoso!</p>
              <p className="mt-0.5 opacity-90">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label
                htmlFor="tiktokUsername"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                TikTok Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <AtSign className="h-4 w-4 text-[#ff2a5f]" />
                </div>
                <input
                  id="tiktokUsername"
                  type="text"
                  required
                  placeholder="@tu_canal_live"
                  value={tiktokUsername}
                  onChange={(e) => setTiktokUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                El usuario de TikTok que usas para tus transmisiones en directo.
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-[#00f0ff]" />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="streamer@galactik.live"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a5f] py-3.5 text-sm font-bold text-black shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(255,42,95,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>{mode === 'register' ? 'Crear Cuenta de Streamer' : 'Iniciar Sesión'}</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-zinc-400 pt-6 border-t border-white/8">
          {mode === 'register' ? (
            <p>
              ¿Ya tienes una cuenta registrada?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-[#00f0ff] hover:underline transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          ) : (
            <p>
              ¿Aún no tienes cuenta?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-[#00f0ff] hover:underline transition-colors"
              >
                Regístrate como Streamer
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
