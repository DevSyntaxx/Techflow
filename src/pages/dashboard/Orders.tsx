import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, FileText, ChevronRight, Download } from 'lucide-react';

// Mock data based on requirements
const mockOrders = [
  { id: 'OS-0042', client: 'João Silva', phone: '(11) 98765-4321', device: 'iPhone 13 Pro', status: 'Em Análise', amount: '-', date: 'Hoje, 10:30' },
  { id: 'OS-0041', client: 'Maria Oliveira', phone: '(11) 91234-5678', device: 'Samsung S22', status: 'Aguardando Peça', amount: 'R$ 450,00', date: 'Ontem, 16:45' },
  { id: 'OS-0040', client: 'Carlos Santos', phone: '(11) 99988-7766', device: 'iPad Air 4', status: 'Pronto', amount: 'R$ 890,00', date: '28/04/2026' },
  { id: 'OS-0039', client: 'Ana Clara', phone: '(11) 97766-5544', device: 'iPhone 11', status: 'Entregue', amount: 'R$ 320,00', date: '27/04/2026' },
  { id: 'OS-0038', client: 'Pedro Mendes', phone: '(11) 96655-4433', device: 'Xiaomi Poco X3', status: 'Aguardando Aprovação', amount: 'R$ 250,00', date: '26/04/2026' },
  { id: 'OS-0037', client: 'Lucia Costa', phone: '(11) 95544-3322', device: 'Motorola Edge', status: 'Em Reparo', amount: 'R$ 600,00', date: '25/04/2026' },
];

const statusColors: Record<string, string> = {
  'Recebido': 'bg-gray-100 text-gray-700',
  'Em Análise': 'bg-blue-100 text-blue-700',
  'Aguardando Aprovação': 'bg-yellow-100 text-yellow-700',
  'Aprovado': 'bg-indigo-100 text-indigo-700',
  'Aguardando Peça': 'bg-orange-100 text-orange-700',
  'Em Reparo': 'bg-purple-100 text-purple-700',
  'Pronto': 'bg-green-100 text-green-700',
  'Saiu para Entrega': 'bg-teal-100 text-teal-700',
  'Entregue': 'bg-gray-100 text-gray-700 border border-gray-200',
  'Cancelado': 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Ordens de Serviço</h1>
          <p className="text-gray-500 text-sm">Gerencie todos os reparos e orçamentos da sua assistência.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
             <Download className="w-4 h-4" /> Exportar
          </button>
          <Link to="/dashboard/orders/new" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <span className="text-[#D4AF37]">+</span> Nova Ordem
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
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
            <Filter className="w-4 h-4" /> Todos os Status
          </button>
          <button className="flex items-center gap-2 bg-[#F5F5F7] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
            Este Mês
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">CÓDIGO</th>
                <th className="px-6 py-4 font-medium">CLIENTE</th>
                <th className="px-6 py-4 font-medium">APARELHO</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
                <th className="px-6 py-4 font-medium">VALOR</th>
                <th className="px-6 py-4 font-medium">DATA</th>
                <th className="px-6 py-4 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F5F5F7]/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1A1A1A]">{order.client}</p>
                    <p className="text-xs text-gray-500">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#1A1A1A]">{order.device}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/dashboard/orders/${order.id}`} className="p-1.5 text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-200 rounded-md transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-between text-sm text-gray-500">
          <span>Mostrando 1 a 6 de 42 ordens</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-[#E5E5E5] hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded border border-[#E5E5E5] bg-[#1A1A1A] text-white">1</button>
            <button className="px-3 py-1 rounded border border-[#E5E5E5] hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded border border-[#E5E5E5] hover:bg-gray-50">3</button>
            <button className="px-3 py-1 rounded border border-[#E5E5E5] hover:bg-gray-50">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
