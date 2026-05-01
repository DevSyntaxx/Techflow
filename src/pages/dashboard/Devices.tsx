import React, { useState, useEffect } from 'react';
import { Search, Plus, Smartphone, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Devices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          client:clients(name)
        `)
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Erro ao buscar aparelhos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter(d => 
    d.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.brand && d.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.client && d.client.name && d.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Aparelhos</h1>
          <p className="text-gray-500 text-sm">Gerencie o histórico de manutenção de todos os dispositivos vinculados aos clientes.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl card-border premium-shadow flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por modelo, marca ou cliente..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando aparelhos...</div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Nenhum aparelho cadastrado</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Os aparelhos são cadastrados automaticamente quando você cria um Cliente ou uma Nova O.S.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">APARELHO</th>
                  <th className="px-6 py-4 font-medium">CLIENTE</th>
                  <th className="px-6 py-4 font-medium">SÉRIE / IMEI</th>
                  <th className="px-6 py-4 font-medium">DATA DE CADASTRO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                          <Smartphone className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1A1A]">{device.brand} {device.model}</p>
                          <p className="text-xs text-gray-500">{device.color || 'Sem cor'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-700">{device.client?.name || 'Cliente Removido'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {device.serial_number || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(device.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;
