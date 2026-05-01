import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Smartphone, Download, Plus, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Clientes e Aparelhos</h1>
          <p className="text-gray-500 text-sm">Gerencie sua base de clientes, histórico de serviços e dispositivos.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to="/dashboard/clients/new" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Novo Cliente
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou email..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 card-border premium-shadow">Carregando clientes...</div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center card-border premium-shadow">
          <User className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Sua base está vazia</h3>
          <p className="text-gray-500 max-w-sm mb-6">Cadastre seu primeiro cliente para começar a vincular aparelhos e OS.</p>
          <Link to="/dashboard/clients/new" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
            Adicionar primeiro Cliente
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Link to={`/dashboard/clients/${client.id}`} key={client.id} className="bg-white rounded-2xl p-5 card-border premium-shadow hover:-translate-y-1 transition-transform group cursor-pointer flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center border border-[#E5E5E5]">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors">{client.name}</h3>
                    <p className="text-xs text-gray-500">{client.phone || 'Sem telefone'}</p>
                  </div>
                </div>
                {client.phone && (
                  <button 
                    className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                    onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/55${client.phone.replace(/\D/g, '')}`, '_blank'); }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="mt-3 bg-[#F5F5F7] p-2 rounded-lg text-xs text-gray-500 flex justify-between items-center">
                <span>Data de Cadastro:</span>
                <span className="font-medium text-[#1A1A1A]">
                  {new Date(client.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default Clients;
