import React from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

const Schedule = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Agenda</h1>
          <p className="text-gray-500 text-sm">Lembretes, coletas e entregas agendadas.</p>
        </div>
        <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden p-8 text-center">
        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Sua agenda está livre</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">Nenhum compromisso ou entrega agendada para os próximos dias.</p>
      </div>
    </div>
  );
};

export default Schedule;
