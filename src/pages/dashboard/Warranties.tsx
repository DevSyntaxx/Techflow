import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Shield, ShieldAlert, ShieldX, Plus, FileText, Printer } from 'lucide-react';

const mockWarranties: any[] = [];

const statusConfig: Record<string, { color: string, icon: any }> = {
  'Ativa': { color: 'bg-green-100 text-green-700 border-green-200', icon: Shield },
  'Vencida': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: ShieldAlert },
  'Cancelada': { color: 'bg-red-100 text-red-700 border-red-200', icon: ShieldX },
};

const Warranties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Garantias Digitais</h1>
          <p className="text-gray-500 text-sm">Controle as garantias ativas e vencidas dos seus clientes.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to="/dashboard/warranties/new" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4 text-[#D4AF37]" /> Nova Garantia
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Garantias Ativas</p>
            <p className="text-3xl font-bold text-[#1A1A1A] mt-1">45</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Vencendo em 7 dias</p>
            <p className="text-3xl font-bold text-[#1A1A1A] mt-1">3</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-2xl premium-shadow flex items-center justify-between text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-sm text-gray-400 font-medium">Retornos em Garantia</p>
            <p className="text-3xl font-bold text-white mt-1">1</p>
            <p className="text-xs text-[#D4AF37] mt-1 font-medium">Taxa de retorno: 2.1%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por código, cliente ou aparelho..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" /> Todas
          </button>
          <button className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors whitespace-nowrap border border-green-100">
            <Shield className="w-4 h-4" /> Apenas Ativas
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">CÓDIGO / O.S.</th>
                <th className="px-6 py-4 font-medium">CLIENTE</th>
                <th className="px-6 py-4 font-medium">APARELHO / SERVIÇO</th>
                <th className="px-6 py-4 font-medium">VENCIMENTO</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
                <th className="px-6 py-4 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {mockWarranties.map((warranty) => {
                const StatusIcon = statusConfig[warranty.status].icon;
                return (
                  <tr key={warranty.id} className="hover:bg-[#F5F5F7]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1A1A1A] flex items-center gap-1">
                         <Shield className="w-4 h-4 text-[#D4AF37]" /> {warranty.id}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <FileText className="w-3 h-3" /> {warranty.os}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                      {warranty.client}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#1A1A1A]">{warranty.device}</p>
                      <p className="text-xs text-gray-500">{warranty.service}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {warranty.expires}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${statusConfig[warranty.status].color}`}>
                          <StatusIcon className="w-3 h-3" /> {warranty.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/warranties/${warranty.id}`} className="bg-white border border-[#E5E5E5] p-2 text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-50 rounded-lg transition-colors shadow-sm" title="Ver / Imprimir">
                          <Printer className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Warranties;
