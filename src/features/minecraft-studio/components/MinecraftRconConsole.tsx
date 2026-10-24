import React, { useState } from 'react';
import { useMinecraftStudioStore } from '../stores/useMinecraftStudioStore';
import { Terminal, Send, Trash2, Shield, Zap, Sparkles, Users } from 'lucide-react';

export const MinecraftRconConsole: React.FC = () => {
  const consoleLogs = useMinecraftStudioStore((s) => s.consoleLogs);
  const sendRconCommand = useMinecraftStudioStore((s) => s.sendRconCommand);
  const clearConsoleLogs = useMinecraftStudioStore((s) => s.clearConsoleLogs);
  const isSendingCommand = useMinecraftStudioStore((s) => s.isSendingCommand);

  const [inputCmd, setInputCmd] = useState('');

  const handleSend = async (cmdToSend?: string) => {
    const cmd = cmdToSend || inputCmd;
    if (!cmd.trim() || isSendingCommand) return;
    await sendRconCommand(cmd);
    if (!cmdToSend) setInputCmd('');
  };

  const quickActions = [
    { label: '+124 Tótems', cmd: 'totems dar {jugador} 124', icon: Shield, color: 'text-[#23E6A8] border-[#23E6A8]/40' },
    { label: 'Visión Nocturna', cmd: 'effect give {jugador} minecraft:night_vision infinite 0 true', icon: Sparkles, color: 'text-[#00D9FF] border-[#00D9FF]/40' },
    { label: 'Trueno', cmd: 'trueno {jugador} rayos=8 potencia=8', icon: Zap, color: 'text-[#FFE600] border-[#FFE600]/40' },
    { label: '+10 Tótems', cmd: 'totems dar {jugador} 10', icon: Shield, color: 'text-[#23E6A8] border-[#23E6A8]/40' },
    { label: 'Dragón', cmd: 'dragon {jugador}', icon: Zap, color: 'text-[#FF4568] border-[#FF4568]/40' },
    { label: 'La Parka', cmd: 'esqueleto {jugador}', icon: Zap, color: 'text-[#FF328B] border-[#FF328B]/40' },
    { label: 'Sol Cruel', cmd: 'solcruel {jugador}', icon: Sparkles, color: 'text-[#FF9100] border-[#FF9100]/40' },
    { label: '/list', cmd: '/list', icon: Users, color: 'text-[#9FB2C8] border-[#24374B]' }
  ];

  return (
    <div className="flex flex-col rounded-3xl border border-[#24374B] bg-[#0A1422] p-5 shadow-2xl">
      {/* Cabecera de la Consola */}
      <div className="flex items-center justify-between border-b border-[#24374B]/70 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#23E6A8]" />
          <h3 className="font-black text-sm tracking-wide text-white">CONSOLA RCON EN VIVO</h3>
          <span className="font-mono text-[10px] text-[#64748B]">({consoleLogs.length} eventos)</span>
        </div>

        <button
          type="button"
          onClick={clearConsoleLogs}
          className="flex items-center gap-1 rounded-lg border border-[#24374B] bg-[#050A12] px-2.5 py-1 text-[11px] font-bold text-[#9FB2C8] hover:border-[#FF4568] hover:text-[#FF4568] transition-all"
        >
          <Trash2 className="h-3 w-3" />
          Limpiar
        </button>
      </div>

      {/* Input de Comando Manual */}
      <div className="my-3 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ej: /title @a title {'text':'¡Hola Stream!'} o /give {jugador} diamond 64"
            className="w-full rounded-xl border border-[#24374B] bg-[#050A12] py-2.5 pl-3.5 pr-10 font-mono text-xs text-white placeholder-[#64748B] focus:border-[#23E6A8] focus:outline-none"
          />
        </div>

        <button
          type="button"
          disabled={!inputCmd.trim() || isSendingCommand}
          onClick={() => handleSend()}
          className="flex items-center gap-1.5 rounded-xl border border-[#23E6A8] bg-gradient-to-r from-[#23E6A8] to-[#168BFF] px-4 py-2.5 font-black text-xs text-black shadow-lg shadow-[#23E6A8]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Enviar</span>
        </button>
      </div>

      {/* Botones de Acciones Rápidas */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => handleSend(action.cmd)}
              className={`flex items-center gap-1 rounded-lg border bg-[#050A12] px-2.5 py-1 text-xs font-bold transition-all hover:brightness-125 active:scale-95 ${action.color}`}
            >
              <Icon className="h-3 w-3" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Terminal Monospace de Salida */}
      <div className="h-44 w-full overflow-y-auto rounded-xl border border-[#24374B] bg-[#050A12] p-3 font-mono text-xs text-[#9FB2C8] [scrollbar-width:thin]">
        {consoleLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[#64748B]">
            Listo para enviar comandos RCON al servidor de Minecraft
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {consoleLogs.map((log) => (
              <div key={log.id} className="leading-tight">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <span className="text-[10px]">[{log.time}]</span>
                  <span className="text-white font-bold">&gt; {log.command}</span>
                </div>
                <div className={`pl-4 ${log.isError ? 'text-[#FF4568]' : 'text-[#23E6A8]'}`}>
                  {log.response}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
