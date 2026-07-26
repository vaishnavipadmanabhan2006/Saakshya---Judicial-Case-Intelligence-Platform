import React from 'react';
import { UrgencyInfo } from '../types';
import { AlertTriangle, Clock, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: UrgencyInfo;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, size = 'md' }) => {
  const level = urgency.level;

  const styles = {
    CRITICAL: {
      bg: 'bg-red-500/15 text-red-300 border-red-500/40',
      dot: 'bg-red-400',
      icon: AlertTriangle,
      label: 'CRITICAL URGENCY'
    },
    HIGH: {
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400',
      icon: AlertOctagon,
      label: 'HIGH PRIORITY'
    },
    MEDIUM: {
      bg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      dot: 'bg-blue-400',
      icon: Clock,
      label: 'REGULAR HEARING'
    },
    LOW: {
      bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      dot: 'bg-emerald-400',
      icon: CheckCircle2,
      label: 'ROUTINE'
    }
  }[level] || {
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-400',
    icon: Clock,
    label: 'NORMAL'
  };

  const IconComponent = styles.icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
        <span>{styles.label}</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-xl border flex items-center justify-between ${styles.bg}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold opacity-80">
              Judicial Triage Rating
            </div>
            <div className="text-base font-bold font-serif">{styles.label}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold font-mono">{urgency.score}<span className="text-xs font-normal text-slate-400">/100</span></div>
          <div className="text-[10px] uppercase font-semibold text-slate-400">Urgency Score</div>
        </div>
      </div>
    );
  }

  // Medium (Default)
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-semibold border ${styles.bg} shadow-sm`}>
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{styles.label}</span>
      <span className="font-mono text-[11px] opacity-80 border-l border-current/30 pl-2">
        {urgency.score} pts
      </span>
    </div>
  );
};
