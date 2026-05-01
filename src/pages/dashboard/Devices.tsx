import React, { useState } from 'react';
import { Search, Filter, Plus, Smartphone, History, CheckCircle } from 'lucide-react';

const Devices = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Aparelhos</h1>
          <p className="text-gray-500 text-sm">Gerencie o histórico de manutenção de todos os dispositivos.</p>
        </div>
        <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Novo Aparelho
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl card-border premium-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Aparelhos Cadastrados</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden p-8 text-center">
        <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Nenhum aparelho cadastrado</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">Os aparelhos são cadastrados automaticamente quando você cria uma Nova O.S ou podem ser adicionados manualmente.</p>
      </div>
    </div>
  );
};

export default Devices;
