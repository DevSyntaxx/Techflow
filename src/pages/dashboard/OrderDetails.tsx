import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, Save, Printer, Share2, 
  User, Smartphone, ClipboardList, PenTool, 
  DollarSign, Camera, MessageSquare, Clock, 
  CheckCircle, Plus
} from 'lucide-react';

const statusList = [
  'Recebido', 'Em Análise', 'Aguardando Aprovação', 'Aprovado', 
  'Aguardando Peça', 'Em Reparo', 'Pronto', 'Saiu para Entrega', 
  'Entregue', 'Cancelado'
];

const timeline = [
  { status: 'OS Criada', user: 'CM Place', date: 'Hoje, 10:30', desc: 'Aparelho recebido na loja.' },
  { status: 'Em Análise', user: 'Técnico Marcos', date: 'Hoje, 11:15', desc: 'Iniciada análise do conector de carga.' }
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('detalhes');
  const [status, setStatus] = useState(isNew ? 'Recebido' : 'Em Análise');

  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [technicalDiagnosis, setTechnicalDiagnosis] = useState('');

  const handleSaveOS = async () => {
    if (!isNew) {
      alert('Atualização de OS em desenvolvimento...');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
        
      if (profileErr) throw profileErr;

      const { data: client, error: clientErr } = await supabase
        .from('clients')
        .insert({ company_id: profile.company_id, name: clientName || 'Cliente Balcão', phone: clientPhone })
        .select().single();
      if (clientErr) throw clientErr;

      const { data: device, error: deviceErr } = await supabase
        .from('devices')
        .insert({ 
          company_id: profile.company_id, 
          client_id: client.id, 
          brand: 'Não informada',
          model: deviceModel || 'Não informado' 
        })
        .select().single();
      if (deviceErr) throw deviceErr;

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          company_id: profile.company_id,
          client_id: client.id,
          device_id: device.id,
          display_id: 'OS-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          reported_problem: problemDescription || technicalDiagnosis || 'Sem descrição',
          status: status
        })
        .select().single();
      if (orderErr) throw orderErr;

      navigate('/dashboard/orders');
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar OS: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl card-border premium-shadow sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1A1A1A]">
                {isNew ? 'Nova Ordem de Serviço' : `OS-0042`}
              </h1>
              {!isNew && (
                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                  {status}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{isNew ? 'Preencha os dados abaixo' : 'Criada Hoje, 10:30 por CM Place'}</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {!isNew && (
            <>
              <button className="bg-[#F5F5F7] text-[#1A1A1A] p-2 rounded-lg hover:bg-gray-200 transition-colors" title="Imprimir Via">
                <Printer className="w-5 h-5" />
              </button>
              <button className="bg-[#F5F5F7] text-[#1A1A1A] p-2 rounded-lg hover:bg-gray-200 transition-colors" title="Compartilhar Link Público">
                <Share2 className="w-5 h-5" />
              </button>
            </>
          )}
          <button 
            onClick={handleSaveOS}
            disabled={loading}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50">
             <Save className="w-4 h-4" /> {loading ? 'Salvando...' : 'Salvar OS'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-[#E5E5E5] gap-6">
            {[
              { id: 'detalhes', label: 'Detalhes Técnicos', icon: ClipboardList },
              { id: 'financeiro', label: 'Orçamento & Peças', icon: DollarSign },
              { id: 'midia', label: 'Fotos (Antes/Depois)', icon: Camera },
              { id: 'obs', label: 'Observações', icon: MessageSquare },
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

          {/* Form Content based on Tab */}
          <div className="bg-white rounded-2xl card-border premium-shadow p-6">
            
            {activeTab === 'detalhes' && (
              <div className="space-y-8">
                {/* Cliente & Aparelho */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                      <User className="w-4 h-4 text-[#D4AF37]" /> Dados do Cliente
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Nome do Cliente</label>
                        <input 
                          type="text" 
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          placeholder="Ex: João da Silva"
                          className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
                        <input 
                          type="text" 
                          value={clientPhone}
                          onChange={e => setClientPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                      <Smartphone className="w-4 h-4 text-[#D4AF37]" /> Aparelho
                    </h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Modelo do Aparelho</label>
                      <input 
                          type="text" 
                          value={deviceModel}
                          onChange={e => setDeviceModel(e.target.value)}
                          placeholder="Ex: iPhone 13 Pro Max"
                          className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all"
                        />
                    </div>
                  </div>
                </div>

                {/* Relato e Diagnóstico */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                    <PenTool className="w-4 h-4 text-[#D4AF37]" /> Análise Técnica
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Problema Relatado (Pelo Cliente)</label>
                    <textarea 
                      rows={3} 
                      value={problemDescription}
                      onChange={e => setProblemDescription(e.target.value)}
                      className="w-full p-3 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all resize-none"
                      placeholder="Ex: Aparelho não carrega e bateria acaba rápido..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Diagnóstico Técnico (Interno)</label>
                    <textarea 
                      rows={4} 
                      value={technicalDiagnosis}
                      onChange={e => setTechnicalDiagnosis(e.target.value)}
                      className="w-full p-3 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all resize-none"
                      placeholder="Análise do técnico após verificar o aparelho..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="flex h-64 items-center justify-center text-gray-400 flex-col gap-2">
                <DollarSign className="w-8 h-8 opacity-50" />
                <p>Módulo financeiro da OS (Em desenvolvimento)</p>
              </div>
            )}
            
            {activeTab === 'midia' && (
              <div className="flex h-64 items-center justify-center text-gray-400 flex-col gap-2">
                <Camera className="w-8 h-8 opacity-50" />
                <p>Upload de fotos antes/depois (Em desenvolvimento)</p>
              </div>
            )}

            {activeTab === 'obs' && (
              <div className="flex h-64 items-center justify-center text-gray-400 flex-col gap-2">
                <MessageSquare className="w-8 h-8 opacity-50" />
                <p>Observações internas e públicas (Em desenvolvimento)</p>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
          {/* Status Control */}
          <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Status Atual
            </h3>
            <select 
              className="w-full p-3 font-semibold bg-[#F5F5F7] border border-[#E5E5E5] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
              <p className="text-xs text-yellow-800 font-medium flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Mudar o status enviará uma mensagem automática no WhatsApp do cliente (se configurado).</span>
              </p>
            </div>
          </div>

          {/* Timeline */}
          {!isNew && (
            <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-6">Linha do Tempo</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E5E5E5] before:to-transparent">
                
                {timeline.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-[#1A1A1A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2">
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-[#F5F5F7] p-3 rounded-lg ml-6 md:ml-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#1A1A1A]">{item.status}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{item.date}</span>
                      </div>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                      <p className="text-[10px] text-gray-400 mt-1 italic">Por {item.user}</p>
                    </div>
                  </div>
                ))}
                
              </div>
            </div>
          )}

          {/* Quick Info summary */}
          {!isNew && (
            <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Resumo Financeiro</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Peças</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Mão de obra</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Desconto</span>
                  <span>- R$ 0,00</span>
                </div>
                <div className="pt-2 border-t border-[#E5E5E5] flex justify-between font-bold text-[#1A1A1A] text-base">
                  <span>Total</span>
                  <span>R$ 0,00</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
