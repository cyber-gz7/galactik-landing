import React, { useEffect } from 'react';
import { useAdminLicensesStore } from './stores/useAdminLicensesStore';
import type { StreamerRole } from '@/types/tauri.types';
import {
  ShieldAlert,
  Search,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Radio
} from 'lucide-react';

export const AdminLicensesWorkspace: React.FC = () => {
  const streamers = useAdminLicensesStore((s) => s.streamers);
  const searchFilter = useAdminLicensesStore((s) => s.searchFilter);
  const setSearchFilter = useAdminLicensesStore((s) => s.setSearchFilter);
  const loadStreamers = useAdminLicensesStore((s) => s.loadStreamers);
  const toggleActive = useAdminLicensesStore((s) => s.toggleActive);
  const toggleMcPlugins = useAdminLicensesStore((s) => s.toggleMcPlugins);
  const resetHwid = useAdminLicensesStore((s) => s.resetHwid);
  const renewLicenseDays = useAdminLicensesStore((s) => s.renewLicenseDays);
  const changeRole = useAdminLicensesStore((s) => s.changeRole);

  useEffect(() => {
    loadStreamers();
  }, [loadStreamers]);

  const filteredStreamers = streamers.filter((s) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      s.username.toLowerCase().includes(q) ||
      s.hwid.toLowerCase().includes(q) ||
      s.license_key.toLowerCase().includes(q)
    );
  });

  const activeCount = streamers.filter((s) => s.is_active).length;
  const pendingCount = streamers.filter((s) => !s.is_active).length;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header con Resumen de Cuentas */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#FF4568]/30 bg-[#0A1422] p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF4568]/15 text-[#FF4568] border border-[#FF4568]/30 shadow-lg shadow-[#FF4568]/10">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg tracking-wide text-white">PANEL DE LICENCIAS &amp; CUENTAS</h2>
              <span className="rounded-full border border-[#FFE600]/40 bg-[#FFE600]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FFE600]">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-[#9FB2C8]">
              Aprobación instantánea, vinculación de HWID y permisos de PaperMC 1.20.1
            </p>
          </div>
        </div>

        {/* KPIs de Licencias */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#23E6A8]/40 bg-[#23E6A8]/10 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#23E6A8]" />
            <span className="font-bold text-xs text-white">{activeCount} Activas</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#FFE600]/40 bg-[#FFE600]/10 px-4 py-2">
            <Users className="h-4 w-4 text-[#FFE600]" />
            <span className="font-bold text-xs text-white">{pendingCount} Pendientes</span>
          </div>
        </div>
      </div>

      {/* 2. Barra de Búsqueda de Streamers */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar por usuario TikTok (@usuario), HWID o clave de licencia..."
            className="w-full rounded-xl border border-[#24374B] bg-[#050A12] py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-[#64748B] focus:border-[#FF4568] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => loadStreamers()}
          className="flex items-center gap-1.5 rounded-xl border border-[#24374B] bg-[#050A12] px-4 py-2.5 text-xs font-bold text-[#9FB2C8] hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Refrescar</span>
        </button>
      </div>

      {/* 3. Tabla de Cuentas de Streamers */}
      <div className="overflow-hidden rounded-3xl border border-[#24374B] bg-[#0A1422] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#24374B] bg-[#050A12] font-mono text-[11px] font-bold text-[#9FB2C8]">
              <tr>
                <th className="px-5 py-3.5">STREAMER</th>
                <th className="px-4 py-3.5">LICENCIA &amp; ROL</th>
                <th className="px-4 py-3.5">HWID (HARDWARE ID)</th>
                <th className="px-4 py-3.5">PLUGINS MC</th>
                <th className="px-4 py-3.5">VENCIMIENTO</th>
                <th className="px-5 py-3.5 text-right">ESTADO / ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24374B]/50">
              {filteredStreamers.map((streamer) => {
                const isExpired = streamer.expires_at < Math.floor(Date.now() / 1000);
                const expDate = new Date(streamer.expires_at * 1000).toLocaleDateString();

                return (
                  <tr
                    key={streamer.username}
                    className="hover:bg-[#101D2E]/50 transition-colors"
                  >
                    {/* Streamer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00D9FF]/10 text-[#00D9FF]">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-black text-white">@{streamer.username}</div>
                          <div className="font-mono text-[10px] text-[#64748B]">
                            Creado: {new Date(streamer.created_at * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Licencia & Rol */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-[#FFE600]">
                          <KeyRound className="h-3 w-3" />
                          <span>{streamer.license_key}</span>
                        </div>
                        <select
                          value={streamer.role}
                          onChange={(e) => changeRole(streamer.username, e.target.value as StreamerRole)}
                          className="w-28 rounded-lg border border-[#24374B] bg-[#050A12] px-2 py-0.5 text-[10px] font-bold text-white focus:outline-none"
                        >
                          <option value="STREAMER">STREAMER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="TRIAL">TRIAL</option>
                        </select>
                      </div>
                    </td>

                    {/* HWID */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#9FB2C8]">
                          {streamer.hwid === '*' ? (
                            <span className="text-[#FFE600] font-bold">Sin vincular (*)</span>
                          ) : (
                            streamer.hwid
                          )}
                        </span>
                        {streamer.hwid !== '*' && (
                          <button
                            type="button"
                            onClick={() => resetHwid(streamer.username)}
                            className="rounded-lg border border-[#24374B] bg-[#050A12] px-2 py-0.5 font-mono text-[10px] font-bold text-[#00D9FF] hover:border-[#00D9FF]"
                            title="Desvincular HWID para permitir cambio de PC"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Plugins Minecraft */}
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleMcPlugins(streamer.username)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[11px] font-bold transition-all ${
                          streamer.allow_mc_plugins
                            ? 'border-[#23E6A8]/50 bg-[#23E6A8]/15 text-[#23E6A8]'
                            : 'border-[#24374B] bg-[#050A12] text-[#64748B]'
                        }`}
                      >
                        <Radio className="h-3 w-3" />
                        <span>{streamer.allow_mc_plugins ? 'Autorizado' : 'Bloqueado'}</span>
                      </button>
                    </td>

                    {/* Vencimiento */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3 text-[#64748B]" />
                          <span className={isExpired ? 'text-[#FF4568] font-bold' : 'text-white'}>
                            {expDate} {isExpired ? '(VENCIDO)' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => renewLicenseDays(streamer.username, 7)}
                            className="rounded bg-[#101D2E] px-1.5 py-0.5 text-[9px] font-bold text-[#9FB2C8] hover:text-white"
                          >
                            +7d
                          </button>
                          <button
                            type="button"
                            onClick={() => renewLicenseDays(streamer.username, 30)}
                            className="rounded bg-[#101D2E] px-1.5 py-0.5 text-[9px] font-bold text-[#00D9FF] hover:text-white"
                          >
                            +30d
                          </button>
                          <button
                            type="button"
                            onClick={() => renewLicenseDays(streamer.username, 365)}
                            className="rounded bg-[#101D2E] px-1.5 py-0.5 text-[9px] font-bold text-[#FFE600] hover:text-white"
                          >
                            +1 año
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Estado & Acciones */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleActive(streamer.username)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-bold text-xs transition-all ${
                          streamer.is_active
                            ? 'border-[#23E6A8]/50 bg-[#23E6A8]/10 text-[#23E6A8] hover:bg-[#23E6A8]/20'
                            : 'border-[#FF4568]/50 bg-[#FF4568]/10 text-[#FF4568] hover:bg-[#FF4568]/20'
                        }`}
                      >
                        {streamer.is_active ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>ACTIVO</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            <span>APROBAR</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
