import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, MapPin, Phone, Mail, Package, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    category: 'Peças Apple'
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('name', { ascending: true });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { error } = await supabase.from('suppliers').insert({
        company_id: profile.company_id,
        ...formData
      });

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ name: '', contact_name: '', phone: '', email: '', category: 'Peças Apple' });
      fetchSuppliers();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro ao salvar fornecedor.');
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Fornecedores</h1>
          <p className="text-gray-500 text-sm">Controle de parceiros comerciais e distribuidores de peças.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando fornecedores...</div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Nenhum fornecedor cadastrado</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Mantenha os contatos dos seus fornecedores salvos para facilitar orçamentos rápidos.</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
              Adicionar primeiro fornecedor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-[#F5F5F7] p-5 rounded-2xl card-border group cursor-pointer hover:bg-white hover:premium-shadow transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-[#E5E5E5]">
                    <Package className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A]">{supplier.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md inline-block mt-1">{supplier.category}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4 pt-4 border-t border-[#E5E5E5]">
                  {supplier.contact_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>{supplier.contact_name}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden premium-shadow animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Novo Fornecedor</h2>
                <p className="text-sm text-gray-500">Cadastre um distribuidor ou parceiro comercial.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="supplier-form" onSubmit={handleCreateSupplier} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Nome da Empresa *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Mega Peças SP" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Nome do Vendedor/Contato</label>
                      <input type="text" value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} placeholder="Ex: Roberto" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Categoria *</label>
                      <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Peças Apple" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Telefone / WhatsApp</label>
                      <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Ex: (11) 99999-9999" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">E-mail</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Ex: vendas@empresa.com" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F7] shrink-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button form="supplier-form" type="submit" className="px-6 py-3 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white hover:bg-black transition-colors premium-shadow">
                Salvar Fornecedor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
