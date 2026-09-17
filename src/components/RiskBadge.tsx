import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true
}) => {
  const config = {
    LOW: {
      label: 'LOW RISK',
      pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-600/10',
      icon: ShieldCheck,
      dotClass: 'bg-emerald-500'
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      pillClass: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/10',
      icon: AlertTriangle,
      dotClass: 'bg-amber-500'
    },
    HIGH: {
      label: 'HIGH RISK',
      pillClass: 'bg-rose-50 text-rose-800 border-rose-200 ring-rose-600/10',
      icon: ShieldAlert,
      dotClass: 'bg-rose-500'
    }
  }[level];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-semibold',
    md: 'text-sm px-3.5 py-1 gap-2 font-bold',
    lg: 'text-base px-4 py-1.5 gap-2.5 font-extrabold'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  return (
    <span
      id={`risk-badge-${level.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${config.pillClass} ${sizeClasses}`}
    >
      <span className={`rounded-full ${config.dotClass} ${size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2'}`} />
      {showIcon && <Icon className={iconSizes} />}
      <span>{config.label}</span>
    </span>
  );
};
