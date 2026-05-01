import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, User, Smartphone, DollarSign, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  novo: { label: 'Novo Lead', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  contatado: { label: 'Contatado', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  orcamento: { label: 'Orçamento Enviado', color: 'bg-purple-100 text-purple-700', icon: DollarSign },
  fechado: { label: 'Fechado (Ganho)', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  perdido: { label: 'Perdido', color: 'bg-red-100 text-red-700', icon: X },
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device_model: '',
    reported_problem: '',
    estimated_value: 0
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { error } = await supabase.from('leads').insert({
        company_id: profile.company_id,
        ...formData
      });

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({
        name: '', phone: '', device_model: '', reported_problem: '', estimated_value: 0
      });
      fetchLeads();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      alert('Erro ao salvar o lead.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar o status.');
    }
  };

  const newLeadsCount = leads.filter(l => l.status === 'novo').length;
  const closedLeadsCount = leads.filter(l => l.status === 'fechado').length;
  const potentialRevenue = leads.filter(l => l.status !== 'perdido' && l.status !== 'fechado').reduce((acc, lead) => acc + (Number(lead.estimated_value) || 0), 0);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.phone.includes(searchTerm) ||
    (lead.device_model && lead.device_model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">CRM & Leads</h1>
          <p className="text-gray-500 text-sm">Gerencie orçamentos e transforme conversas em clientes.</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
           <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Novos Leads</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{newLeadsCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Serviços Fechados</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{closedLeadsCount}</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-2xl premium-shadow flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Receita Potencial</p>
            <p className="text-2xl font-bold text-white">{formatMoney(potentialRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou aparelho..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando CRM...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Target className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Seu funil está vazio</h3>
            <p className="text-gray-500 max-w-sm mb-6">Cadastre potenciais clientes que entraram em contato mas ainda não fecharam serviço.</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
              Adicionar primeiro Lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">CLIENTE</th>
                  <th className="px-6 py-4 font-medium">APARELHO / PROBLEMA</th>
                  <th className="px-6 py-4 font-medium">VALOR (ESTIMADO)</th>
                  <th className="px-6 py-4 font-medium">STATUS DO FUNIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredLeads.map((lead) => {
                  const StatusIcon = statusConfig[lead.status]?.icon || User;
                  
                  return (
                    <tr key={lead.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1A1A1A]">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{lead.device_model || 'Não informado'}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{lead.reported_problem || 'Sem descrição'}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#1A1A1A]">
                        {lead.estimated_value > 0 ? formatMoney(lead.estimated_value) : '--'}
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-none cursor-pointer outline-none appearance-none ${statusConfig[lead.status]?.color || 'bg-gray-100'}`}
                          style={{ paddingRight: '2rem' }}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key} className="bg-white text-black">{config.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden premium-shadow animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Novo Lead (Orçamento)</h2>
                <p className="text-sm text-gray-500">Cadastre um potencial cliente que demonstrou interesse.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="lead-form" onSubmit={handleCreateLead} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Nome do Cliente *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Lucas Mendes" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">WhatsApp *</label>
                    <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Ex: (11) 99999-9999" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Modelo do Aparelho</label>
                      <input type="text" value={formData.device_model} onChange={e => setFormData({...formData, device_model: e.target.value})} placeholder="Ex: iPhone 12 Pro Max" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Valor Estimado (R$)</label>
                      <input type="number" step="0.01" min="0" value={formData.estimated_value} onChange={e => setFormData({...formData, estimated_value: parseFloat(e.target.value)})} placeholder="Ex: 850.00" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Relato do Problema</label>
                    <textarea rows={3} value={formData.reported_problem} onChange={e => setFormData({...formData, reported_problem: e.target.value})} placeholder="O que o cliente disse que está acontecendo?" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F7] shrink-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button form="lead-form" type="submit" className="px-6 py-3 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white hover:bg-black transition-colors premium-shadow">
                Salvar Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
