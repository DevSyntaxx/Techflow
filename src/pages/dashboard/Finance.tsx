import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, Plus, ArrowUpRight, ArrowDownRight, CreditCard, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: 0,
    status: 'paid',
    due_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('finance')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const payload = {
        company_id: profile.company_id,
        ...formData,
        paid_date: formData.status === 'paid' ? new Date().toISOString() : null
      };

      const { error } = await supabase.from('finance').insert(payload);

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ type: 'income', description: '', amount: 0, status: 'paid', due_date: new Date().toISOString().split('T')[0] });
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar transação.');
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'paid').reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Financeiro</h1>
          <p className="text-gray-500 text-sm">Controle de receitas, despesas e fluxo de caixa.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Lançamento Manual
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Entradas (Pagas)</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{formatMoney(totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Saídas (Pagas)</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{formatMoney(totalExpense)}</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-2xl premium-shadow flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Saldo Atual</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              {formatMoney(balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando financeiro...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CreditCard className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Sem movimentações</h3>
            <p className="text-gray-500 max-w-sm mb-6">Cadastre receitas ou despesas para visualizar seu fluxo de caixa.</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
              Fazer 1º Lançamento
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">DESCRIÇÃO</th>
                  <th className="px-6 py-4 font-medium">DATA</th>
                  <th className="px-6 py-4 font-medium">STATUS</th>
                  <th className="px-6 py-4 font-medium text-right">VALOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <p className="font-semibold text-[#1A1A1A]">{t.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(t.due_date || t.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {t.status === 'paid' ? 'Pago / Recebido' : 'Pendente'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-[#1A1A1A]'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden premium-shadow animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Novo Lançamento</h2>
                <p className="text-sm text-gray-500">Adicione uma receita ou despesa manual.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="finance-form" onSubmit={handleCreateTransaction} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`py-3 rounded-xl font-medium border-2 transition-all ${formData.type === 'income' ? 'border-green-500 bg-green-50 text-green-700' : 'border-[#E5E5E5] bg-white text-gray-500 hover:border-gray-300'}`}>
                      <div className="flex justify-center items-center gap-2"><ArrowUpRight className="w-5 h-5" /> Receita</div>
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`py-3 rounded-xl font-medium border-2 transition-all ${formData.type === 'expense' ? 'border-red-500 bg-red-50 text-red-700' : 'border-[#E5E5E5] bg-white text-gray-500 hover:border-gray-300'}`}>
                      <div className="flex justify-center items-center gap-2"><ArrowDownRight className="w-5 h-5" /> Despesa</div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Descrição *</label>
                    <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Compra de Telas, Pagamento Luz..." className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Valor (R$) *</label>
                      <input required type="number" step="0.01" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Data *</label>
                      <input required type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors">
                      <input type="checkbox" checked={formData.status === 'paid'} onChange={e => setFormData({...formData, status: e.target.checked ? 'paid' : 'pending'})} className="w-5 h-5 accent-[#1A1A1A] rounded" />
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Já foi pago/recebido</p>
                        <p className="text-xs text-gray-500">Marque se o dinheiro já saiu ou entrou na conta.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F7] shrink-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button form="finance-form" type="submit" className="px-6 py-3 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white hover:bg-black transition-colors premium-shadow">
                Salvar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
