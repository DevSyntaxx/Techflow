import React from 'react';
import { Target, Plus } from 'lucide-react';

const Leads = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Leads (CRM)</h1>
          <p className="text-gray-500 text-sm">Pipeline de vendas, orçamentos pendentes e contatos.</p>
        </div>
        <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden p-8 text-center">
        <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Seu funil está vazio</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">Adicione potenciais clientes que entraram em contato mas ainda não fecharam serviço.</p>
      </div>
    </div>
  );
};

export default Leads;
