import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Smartphone, MapPin, Mail, Phone, 
  Clock, FileText, CheckCircle, Save, PenTool, Plus, Shield
} from 'lucide-react';

const mockClient = {
  id: '1',
  name: 'João Silva',
  phone: '(11) 98765-4321',
  email: 'joao.silva@email.com',
  cpf: '123.456.789-00',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  obs: 'Cliente prefere contato por WhatsApp. Sempre pedir aprovação antes de trocar peça.',
  spent: 'R$ 1.450,00',
  devices: [
    { id: 'DEV-1', model: 'iPhone 13 Pro', color: 'Azul Sierra', storage: '256GB', imei: '358123456789012', status: 'Em Análise (OS-0042)' },
    { id: 'DEV-2', model: 'iPad Air 4', color: 'Cinza Espacial', storage: '64GB', imei: '-', status: 'Entregue (OS-0010)' }
  ]
};

const ClientDetails = () => {
  const { id } = useParams();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('aparelhos');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl card-border premium-shadow sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/clients" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5F5F7] rounded-full flex items-center justify-center border border-[#E5E5E5] hidden sm:flex">
              <User className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A]">
                {isNew ? 'Novo Cliente' : mockClient.name}
              </h1>
              <p className="text-gray-500 text-sm">{isNew ? 'Cadastro' : `Cliente desde Jan/2026 • Total gasto: ${mockClient.spent}`}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {!isNew && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
               <Phone className="w-4 h-4" /> Chamar WhatsApp
            </button>
          )}
          <button className="bg-[#1A1A1A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
             <Save className="w-4 h-4" /> {isNew ? 'Criar Cliente' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Client Form/Data */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl card-border premium-shadow p-6">
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-4 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <User className="w-4 h-4 text-[#D4AF37]" /> Dados Pessoais
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome Completo</label>
                <input type="text" defaultValue={!isNew ? mockClient.name : ''} className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" defaultValue={!isNew ? mockClient.phone : ''} className="w-full pl-9 p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" defaultValue={!isNew ? mockClient.email : ''} className="w-full pl-9 p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CPF (Opcional)</label>
                <input type="text" defaultValue={!isNew ? mockClient.cpf : ''} className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all" />
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-[#1A1A1A] mt-8 mb-4 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" /> Endereço
            </h3>
            
            <div>
              <textarea rows={2} defaultValue={!isNew ? mockClient.address : ''} className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all resize-none"></textarea>
            </div>

            <h3 className="text-sm font-bold text-[#1A1A1A] mt-8 mb-4 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <PenTool className="w-4 h-4 text-[#D4AF37]" /> Observações Internas
            </h3>
            
            <div>
              <textarea rows={3} defaultValue={!isNew ? mockClient.obs : ''} className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Right Col: Devices & History */}
        {!isNew && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-[#E5E5E5] gap-6">
              {[
                { id: 'aparelhos', label: 'Aparelhos Vinculados', icon: Smartphone },
                { id: 'historico', label: 'Histórico de OS', icon: Clock },
                { id: 'garantias', label: 'Garantias', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'border-[#1A1A1A] text-[#1A1A1A]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Devices View */}
            {activeTab === 'aparelhos' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#1A1A1A]">Aparelhos do Cliente</h3>
                  <button className="text-sm font-medium text-[#1A1A1A] hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Adicionar Aparelho
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockClient.devices.map(device => (
                    <div key={device.id} className="bg-white p-5 rounded-xl card-border premium-shadow group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F5F5F7] rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-[#1A1A1A]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1A1A1A]">{device.model}</h4>
                            <p className="text-xs text-gray-500">{device.color} • {device.storage}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>IMEI/Série:</span>
                          <span className="font-medium text-[#1A1A1A]">{device.imei}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Status atual:</span>
                          <span className={`px-2 py-0.5 rounded-md font-semibold ${device.status.includes('Entregue') ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                            {device.status}
                          </span>
                        </div>
                      </div>
                      
                      <button className="w-full mt-4 py-2 bg-[#F5F5F7] text-[#1A1A1A] rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                        Ver Histórico do Aparelho
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="bg-white rounded-2xl card-border premium-shadow overflow-hidden">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#F5F5F7] border-b border-[#E5E5E5] text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">CÓDIGO</th>
                      <th className="px-6 py-4 font-medium">APARELHO</th>
                      <th className="px-6 py-4 font-medium">VALOR</th>
                      <th className="px-6 py-4 font-medium">DATA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    <tr className="hover:bg-[#F5F5F7]/50 cursor-pointer">
                      <td className="px-6 py-4 font-semibold text-[#1A1A1A]">OS-0042</td>
                      <td className="px-6 py-4">iPhone 13 Pro</td>
                      <td className="px-6 py-4">-</td>
                      <td className="px-6 py-4 text-gray-500">Hoje, 10:30</td>
                    </tr>
                    <tr className="hover:bg-[#F5F5F7]/50 cursor-pointer">
                      <td className="px-6 py-4 font-semibold text-[#1A1A1A]">OS-0010</td>
                      <td className="px-6 py-4">iPad Air 4</td>
                      <td className="px-6 py-4 text-[#1A1A1A] font-medium">R$ 850,00</td>
                      <td className="px-6 py-4 text-gray-500">12/02/2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'garantias' && (
              <div className="flex h-64 items-center justify-center text-gray-400 flex-col gap-2 border-2 border-dashed border-[#E5E5E5] rounded-2xl">
                <Shield className="w-8 h-8 opacity-50" />
                <p>Nenhuma garantia ativa no momento.</p>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
