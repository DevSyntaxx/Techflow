import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Search, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const typeConfig: Record<string, { label: string, color: string }> = {
  coleta: { label: 'Coleta de Aparelho', color: 'bg-blue-100 text-blue-700' },
  entrega: { label: 'Entrega de Aparelho', color: 'bg-green-100 text-green-700' },
  reuniao: { label: 'Reunião/Visita', color: 'bg-purple-100 text-purple-700' },
};

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    type: 'coleta',
    status: 'pending'
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { error } = await supabase.from('schedule').insert({
        company_id: profile.company_id,
        ...formData
      });

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ title: '', description: '', scheduled_at: '', type: 'coleta', status: 'pending' });
      fetchSchedule();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento.');
    }
  };

  const handleCompleteEvent = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const { error } = await supabase.from('schedule').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchSchedule();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Agenda e Lembretes</h1>
          <p className="text-gray-500 text-sm">Lembretes, coletas e entregas agendadas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar evento..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando agenda...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Sua agenda está livre</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Nenhum compromisso ou entrega agendada para os próximos dias.</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors">
              Criar primeiro compromisso
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E5]">
            {filteredEvents.map((event) => (
              <div key={event.id} className={`p-6 flex items-start gap-4 transition-colors hover:bg-[#F5F5F7]/50 ${event.status === 'completed' ? 'opacity-60' : ''}`}>
                <button 
                  onClick={() => handleCompleteEvent(event.id, event.status)}
                  className="mt-1 shrink-0"
                >
                  {event.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 transition-colors"></div>
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className={`font-bold text-lg ${event.status === 'completed' ? 'line-through text-gray-500' : 'text-[#1A1A1A]'}`}>
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${typeConfig[event.type]?.color || 'bg-gray-100'}`}>
                        {typeConfig[event.type]?.label || event.type}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                        <Clock className="w-4 h-4" />
                        {new Date(event.scheduled_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden premium-shadow animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Novo Agendamento</h2>
                <p className="text-sm text-gray-500">Adicione um compromisso na sua agenda.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="schedule-form" onSubmit={handleCreateEvent} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Título do Compromisso *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Entregar iPhone 13 Pro" className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Data e Hora *</label>
                      <input required type="datetime-local" value={formData.scheduled_at} onChange={e => setFormData({...formData, scheduled_at: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Tipo *</label>
                      <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all appearance-none">
                        <option value="coleta">Coleta</option>
                        <option value="entrega">Entrega</option>
                        <option value="reuniao">Reunião/Visita</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Descrição / Detalhes</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Endereço, detalhes do cliente..." className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F7] shrink-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button form="schedule-form" type="submit" className="px-6 py-3 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white hover:bg-black transition-colors premium-shadow">
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
