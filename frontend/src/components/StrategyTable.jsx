'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { Edit2, Trash2, TrendingUp, Shield, Activity, BarChart3 } from 'lucide-react';

const RiskBadge = ({ level }) => {
  const styles = {
    Low: 'bg-green-50 text-green-700 border-green-200',
    Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    High: 'bg-red-50 text-red-700 border-red-200',
  };
  
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${styles[level] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {level}
    </span>
  );
};

const BotIcon = ({ type }) => {
  switch (type) {
    case 'Arbitrage': return <Activity size={14} className="text-brand-blue" />;
    case 'Trend': return <TrendingUp size={14} className="text-brand-blue" />;
    case 'Mean Reversion': return <BarChart3 size={14} className="text-brand-blue" />;
    case 'Scalping': return <Shield size={14} className="text-brand-blue" />;
    default: return <Activity size={14} className="text-brand-blue" />;
  }
};

export default function StrategyTable({ strategies, onEdit, onDelete }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!strategies.length) {
    return (
      <div className="card p-12 text-center">
        <p className="text-text-secondary">No strategies found. {isAdmin ? 'Create one to get started.' : 'Contact an admin to add strategies.'}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="table-header">Title</th>
            <th className="table-header">Type</th>
            <th className="table-header text-center">Risk Level</th>
            <th className="table-header text-right">Target ROI</th>
            <th className="table-header">Created By</th>
            {isAdmin && <th className="table-header text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy) => (
            <tr key={strategy.id} className="hover:bg-bg-surface/50 transition-colors">
              <td className="table-cell font-semibold text-text-main">
                {strategy.title}
              </td>
              <td className="table-cell">
                <div className="flex items-center gap-2 text-text-secondary">
                  <BotIcon type={strategy.bot_type} />
                  <span>{strategy.bot_type}</span>
                </div>
              </td>
              <td className="table-cell text-center">
                <RiskBadge level={strategy.risk_level} />
              </td>
              <td className="table-cell text-right">
                <span className="font-mono font-bold text-brand-green">
                  +{strategy.target_roi.toFixed(1)}%
                </span>
              </td>
              <td className="table-cell">
                <div className="flex flex-col">
                  <span className="text-xs text-text-main font-medium">{strategy.creator_email?.split('@')[0]}</span>
                  <span className="text-[10px] text-text-secondary italic">
                    {new Date(strategy.created_at).toLocaleDateString()}
                  </span>
                </div>
              </td>
              {isAdmin && (
                <td className="table-cell text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(strategy)}
                      className="p-1.5 text-text-secondary hover:text-brand-blue hover:bg-brand-blue/5 rounded transition-all"
                      title="Edit Strategy"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(strategy.id)}
                      className="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      title="Delete Strategy"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
