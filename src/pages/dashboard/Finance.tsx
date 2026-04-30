import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Filter, Search, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockTransactions = [
  { id: 'TRX-101', desc: 'OS-0039 - Troca de Tela iPhone 11', type: 'income', category: 'Serviço', date: '27/04/2026', amount: 'R$ 320,00' },
  { id: 'TRX-102', desc: 'OS-0040 - Bateria iPad Air 4', type: 'income', category: 'Serviço', date: '28/04/2026', amount: 'R$ 890,00' },
  { id: 'TRX-103', desc: 'Compra de Telas (Fornecedor X)', type: 'expense', category: 'Peças', date: '29/04/2026', amount: 'R$ -1.450,00' },
  { id: 'TRX-104', desc: 'Conta de Luz', type: 'expense', category: 'Fixo', date: '30/04/2026', amount: 'R$ -250,00' },
  { id: 'TRX-105', desc: 'OS-0041 - Adiantamento', type: 'income', category: 'Serviço', date: '30/04/2026', amount: 'R$ 150,00' },
];

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Financeiro</h1>
          <p className="text-gray-500 text-sm">Controle de fluxo de caixa, receitas e despesas.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
             <Download className="w-4 h-4" /> Exportar
          </button>
          <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Nova Transação
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl card-border premium-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Entradas (Mês)</h3>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">R$ 14.250,00</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-4 h-4" /> +12.5% vs. mês passado
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl card-border premium-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Saídas (Mês)</h3>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">R$ 8.130,00</p>
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-4 h-4" /> +4.2% vs. mês passado
          </p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-2xl premium-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-sm">Lucro Líquido Estimado</h3>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">R$ 6.120,00</p>
            <p className="text-sm text-[#D4AF37] mt-2 font-medium">Margem: 42.9%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar transação..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" /> Todas as Categorias
          </button>
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            Este Mês
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">DESCRIÇÃO</th>
                <th className="px-6 py-4 font-medium">CATEGORIA</th>
                <th className="px-6 py-4 font-medium">DATA</th>
                <th className="px-6 py-4 font-medium text-right">VALOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {mockTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1A1A1A]">{trx.desc}</p>
                    <p className="text-xs text-gray-500">{trx.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
                      {trx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {trx.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {trx.amount}
                    </span>
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

export default Finance;
