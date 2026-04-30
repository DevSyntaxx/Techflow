import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, User, Smartphone, Download, Plus, MessageCircle } from 'lucide-react';

const mockClients: any[] = [];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Clientes e Aparelhos</h1>
          <p className="text-gray-500 text-sm">Gerencie sua base de clientes, histórico de serviços e dispositivos.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
             <Download className="w-4 h-4" /> Exportar
          </button>
          <Link to="/dashboard/clients/new" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Novo Cliente
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
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
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" /> Todos
          </button>
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            Mais Valiosos
          </button>
        </div>
      </div>

      {/* Grid view for clients (More visual than table for CRM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClients.map((client) => (
          <Link to={`/dashboard/clients/${client.id}`} key={client.id} className="bg-white rounded-2xl p-5 card-border premium-shadow hover:-translate-y-1 transition-transform group cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center border border-[#E5E5E5]">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors">{client.name}</h3>
                  <p className="text-xs text-gray-500">{client.phone}</p>
                </div>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                onClick={(e) => { e.preventDefault(); /* open whatsapp */ }}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-[#E5E5E5]">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Aparelhos</p>
                <p className="font-medium flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-gray-400" /> {client.devices}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Gasto</p>
                <p className="font-medium text-[#1A1A1A]">{client.spent}</p>
              </div>
            </div>
            
            <div className="mt-3 bg-[#F5F5F7] p-2 rounded-lg text-xs text-gray-500 flex justify-between">
              <span>Último atendimento:</span>
              <span className="font-medium text-[#1A1A1A]">{client.lastVisit}</span>
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default Clients;
