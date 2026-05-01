'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import StrategyTable from '@/components/StrategyTable';
import StrategyModal from '@/components/StrategyModal';
import { Plus, Search, RefreshCw, Filter, TrendingUp, Users, Shield } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState([]);
  const [filteredStrategies, setFilteredStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);

  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/strategies');
      setStrategies(response.data);
      setFilteredStrategies(response.data);
    } catch (error) {
      console.error('Failed to fetch strategies', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredStrategies(
      strategies.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.bot_type.toLowerCase().includes(term)
      )
    );
  }, [search, strategies]);

  const handleSave = async (data, id) => {
    try {
      if (id) {
        await api.put(`/strategies/${id}`, data);
      } else {
        await api.post('/strategies', data);
      }
      await fetchStrategies();
      return true;
    } catch (error) {
      console.error('Save failed', error);
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      try {
        await api.delete(`/strategies/${id}`);
        await fetchStrategies();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Strategy Console</h1>
          <p className="text-text-secondary text-sm">Manage and monitor your automated trading pipelines.</p>
        </div>
        <button 
          onClick={() => {
            setEditingStrategy(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 self-start md:self-auto"
        >
          <Plus size={18} />
          Create Strategy
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase">Active Strategies</p>
            <p className="text-xl font-bold text-text-main">{strategies.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="bg-brand-green/10 p-2 rounded-lg text-brand-green">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase">Avg. Target ROI</p>
            <p className="text-xl font-bold text-text-main">
              {strategies.length > 0 
                ? (strategies.reduce((acc, s) => acc + s.target_roi, 0) / strategies.length).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase">Platform Users</p>
            <p className="text-xl font-bold text-text-main">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by title or type..."
              className="input-field !pl-11 py-1.5 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchStrategies}
            className="p-2 text-text-secondary hover:text-brand-blue hover:bg-white border border-transparent hover:border-border-light rounded transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* User Guidance Section */}
        <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-lg p-4 flex items-start gap-4">
          <div className="bg-brand-blue text-white p-1.5 rounded-md mt-0.5">
            <Shield size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-main">
              Strategy Management
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              You can monitor all active trading strategies in the global pool. You are authorized to create new strategies, and you can edit or delete any strategies that you have personally created. Administrators have full access to manage all strategies.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card p-20 flex flex-col items-center justify-center gap-4">
            <RefreshCw size={32} className="text-brand-blue animate-spin" />
            <p className="text-text-secondary animate-pulse">Syncing with secure server...</p>
          </div>
        ) : (
          <StrategyTable 
            strategies={filteredStrategies} 
            onEdit={(s) => {
              setEditingStrategy(s);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      <StrategyModal 
        strategy={editingStrategy}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStrategy(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
