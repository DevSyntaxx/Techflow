import React, { useState, useEffect } from 'react';
import { Download, Search, Filter, Plus, Package, AlertTriangle, ArrowRightLeft, DollarSign, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const statusConfig: Record<string, { label: string, color: string }> = {
  normal: { label: 'Em Estoque', color: 'bg-green-100 text-green-700' },
  low: { label: 'Estoque Baixo', color: 'bg-orange-100 text-orange-700' },
  empty: { label: 'Esgotado', color: 'bg-red-100 text-red-700' },
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Tela',
    compatibility: '',
    quantity: 0,
    min_quantity: 5,
    cost_price: 0,
    selling_price: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { error } = await supabase.from('inventory').insert({
        company_id: profile.company_id,
        ...formData
      });

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({
        name: '', sku: '', category: 'Tela', compatibility: '', quantity: 0, min_quantity: 5, cost_price: 0, selling_price: 0
      });
      fetchInventory();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar o item.');
    }
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity <= item.min_quantity).length;
  const totalCost = items.reduce((acc, item) => acc + (item.quantity * item.cost_price), 0);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Estoque de Peças</h1>
          <p className="text-gray-500 text-sm">Controle as peças disponíveis, custos e margem de lucro.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
             <ArrowRightLeft className="w-4 h-4" /> Movimentações
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Nova Peça
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Peças Físicas</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Modelos em Alerta</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{lowStockItems}</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-2xl premium-shadow flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Custo em Estoque</p>
            <p className="text-2xl font-bold text-white">{formatMoney(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, SKU ou categoria..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando estoque...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Nenhum item encontrado</h3>
            <p className="text-gray-500 max-w-sm mb-6">Você ainda não tem peças cadastradas ou a busca não encontrou resultados.</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
              Cadastrar primeira peça
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">PEÇA / SKU</th>
                  <th className="px-6 py-4 font-medium">COMPATIBILIDADE</th>
                  <th className="px-6 py-4 font-medium">STATUS / QTD</th>
                  <th className="px-6 py-4 font-medium text-right">CUSTO</th>
                  <th className="px-6 py-4 font-medium text-right">VENDA (SUGERIDA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredItems.map((item) => {
                  let status = 'normal';
                  if (item.quantity === 0) status = 'empty';
                  else if (item.quantity <= item.min_quantity) status = 'low';

                  return (
                    <tr key={item.id} className="hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.sku || 'Sem código'} • {item.category}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {item.compatibility || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusConfig[status].color}`}>
                            {statusConfig[status].label}
                          </span>
                          <span className="font-bold text-[#1A1A1A]">{item.quantity} un.</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {formatMoney(item.cost_price)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#1A1A1A]">
                        {formatMoney(item.selling_price)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nova Peça */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden premium-shadow animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Cadastrar Peça</h2>
                <p className="text-sm text-gray-500">Adicione um novo item ao estoque da loja.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="inventory-form" onSubmit={handleCreateItem} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Nome da Peça *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Tela Original iPhone 13" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Código / SKU</label>
                    <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Ex: TELA-IP13-001" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Categoria *</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all appearance-none">
                      <option value="Tela">Tela</option>
                      <option value="Bateria">Bateria</option>
                      <option value="Placa">Placa</option>
                      <option value="Câmera">Câmera</option>
                      <option value="Carcaça">Carcaça</option>
                      <option value="Acessório">Acessório</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Compatibilidade</label>
                    <input type="text" value={formData.compatibility} onChange={e => setFormData({...formData, compatibility: e.target.value})} placeholder="Ex: iPhone 13, 13 Pro" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Qtd Atual *</label>
                    <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Qtd Mínima (Alerta) *</label>
                    <input required type="number" min="0" value={formData.min_quantity} onChange={e => setFormData({...formData, min_quantity: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Preço de Custo (R$) *</label>
                    <input required type="number" step="0.01" min="0" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Preço Sugerido (R$) *</label>
                    <input required type="number" step="0.01" min="0" value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F7] shrink-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button form="inventory-form" type="submit" className="px-6 py-3 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white hover:bg-black transition-colors premium-shadow">
                Salvar Peça
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

