'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';

export default function StrategyModal({ strategy, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    bot_type: 'Arbitrage',
    risk_level: 'Medium',
    target_roi: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (strategy) {
      setFormData({
        title: strategy.title,
        bot_type: strategy.bot_type,
        risk_level: strategy.risk_level,
        target_roi: strategy.target_roi.toString(),
      });
    } else {
      setFormData({
        title: '',
        bot_type: 'Arbitrage',
        risk_level: 'Medium',
        target_roi: '',
      });
    }
  }, [strategy, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      target_roi: parseFloat(formData.target_roi),
    };

    const success = await onSave(payload, strategy?.id);
    if (success) {
      onClose();
    } else {
      setError('Failed to save strategy. Please check your inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text-main/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="card w-full max-w-md relative z-10 shadow-xl">
        <div className="px-6 py-4 border-b border-border-light flex items-center justify-between bg-bg-surface/50">
          <h2 className="text-lg font-bold text-text-main">
            {strategy ? 'Edit Strategy' : 'New Trading Strategy'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-main p-1 rounded-full hover:bg-bg-surface">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Strategy Title
            </label>
            <input
              type="text"
              required
              className="input-field text-sm"
              placeholder="e.g. BTC Arbitrage Alpha"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Bot Type
              </label>
              <select
                className="input-field text-sm"
                value={formData.bot_type}
                onChange={(e) => setFormData({ ...formData, bot_type: e.target.value })}
              >
                <option value="Arbitrage">Arbitrage</option>
                <option value="Trend">Trend</option>
                <option value="Mean Reversion">Mean Reversion</option>
                <option value="Scalping">Scalping</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Risk Profile
              </label>
              <select
                className="input-field text-sm"
                value={formData.risk_level}
                onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Target ROI (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                required
                className="input-field text-sm pr-8"
                placeholder="12.5"
                value={formData.target_roi}
                onChange={(e) => setFormData({ ...formData, target_roi: e.target.value })}
              />
              <span className="absolute right-3 top-2 text-text-secondary font-bold text-xs">%</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary flex-1 text-sm py-2.5"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {strategy ? 'Update Strategy' : 'Create Strategy'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
