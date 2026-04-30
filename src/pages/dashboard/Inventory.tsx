import React, { useState } from 'react';
import { Download, Search, Filter, Plus, Package, AlertTriangle, ArrowRightLeft, DollarSign } from 'lucide-react';

const mockItems: any[] = [];

const statusConfig: Record<string, { label: string, color: string }> = {
  normal: { label: 'Em Estoque', color: 'bg-green-100 text-green-700' },
  low: { label: 'Estoque Baixo', color: 'bg-orange-100 text-orange-700' },
  empty: { label: 'Esgotado', color: 'bg-red-100 text-red-700' },
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
          <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
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
            <p className="text-sm text-gray-500 font-medium">Total de Itens</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">124</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Estoque Baixo</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">12</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-2xl premium-shadow flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Custo em Estoque</p>
            <p className="text-2xl font-bold text-white">R$ 18.450,00</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, marca ou categoria..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" /> Todas Categorias
          </button>
          <button className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors whitespace-nowrap border border-orange-100">
            <AlertTriangle className="w-4 h-4" /> Baixo/Esgotado
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">PEÇA / CÓDIGO</th>
                <th className="px-6 py-4 font-medium">COMPATIBILIDADE</th>
                <th className="px-6 py-4 font-medium">STATUS / QTD</th>
                <th className="px-6 py-4 font-medium text-right">CUSTO</th>
                <th className="px-6 py-4 font-medium text-right">VENDA (SUGERIDA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {mockItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.id} • {item.category}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.model}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusConfig[item.status].color}`}>
                        {statusConfig[item.status].label}
                      </span>
                      <span className="font-bold text-[#1A1A1A]">{item.qtd} un.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {item.cost}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#1A1A1A]">
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
