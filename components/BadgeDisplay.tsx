import React from 'react';
import { BadgeType } from '../types';

interface BadgeDisplayProps {
  badges: BadgeType[];
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  if (!badges || badges.length === 0) return null;

  const getBadgeIcon = (type: BadgeType) => {
    switch (type) {
      case BadgeType.PYTHON_EXPERT:
        return { icon: 'code', color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Python Expert' };
      case BadgeType.CRYPTO_MASTER:
        return { icon: 'vpn_key', color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Crypto Master' };
      case BadgeType.RED_TEAM:
        return { icon: 'whatshot', color: 'text-red-400', bg: 'bg-red-400/10', title: 'Red Team' };
      case BadgeType.TERMINAL:
        return { icon: 'terminal', color: 'text-green-400', bg: 'bg-green-400/10', title: 'Terminal' };
      case BadgeType.BUG_REPORT:
        return { icon: 'bug_report', color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'Bug Hunter' };
      case BadgeType.DNS:
        return { icon: 'dns', color: 'text-indigo-400', bg: 'bg-indigo-400/10', title: 'Network' };
      case BadgeType.SHIELD:
        return { icon: 'shield', color: 'text-orange-400', bg: 'bg-orange-400/10', title: 'Defense' };
      case BadgeType.ROUTER:
        return { icon: 'router', color: 'text-cyan-400', bg: 'bg-cyan-400/10', title: 'Infrastructure' };
      default:
        return { icon: 'star', color: 'text-gray-400', bg: 'bg-gray-400/10', title: 'Badge' };
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {badges.map((badge) => {
        const style = getBadgeIcon(badge);
        return (
          <span
            key={badge}
            className={`material-symbols-outlined text-lg p-1 rounded ${style.color} ${style.bg}`}
            title={style.title}
          >
            {style.icon}
          </span>
        );
      })}
    </div>
  );
};