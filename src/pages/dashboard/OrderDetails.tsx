import React, { useState, useEffect } from 'react';
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('detalhes');
  const [status, setStatus] = useState('Recebido');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [orderData, setOrderData] = useState<any>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [technicalDiagnosis, setTechnicalDiagnosis] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const [finance, setFinance] = useState({
    parts: 0,
    labor: 0,
    discount: 0
  });

  useEffect(() => {
    if (!isNew) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`*, client:clients(name, phone), device:devices(model)`)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setOrderData(data);
        setStatus(data.status);
        setClientName(data.client?.name || '');
        setClientPhone(data.client?.phone || '');
        setDeviceModel(data.device?.model || '');
        setProblemDescription(data.reported_problem || '');
        setTechnicalDiagnosis(data.technical_diagnosis || '');
        setInternalNotes(data.internal_notes || '');
        
        // Load finance if exists in json
        if (data.finance_summary) {
          setFinance(data.finance_summary);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar OS.');
    } finally {
      setFetching(false);
    }
  };

  const handleSaveOS = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) throw new Error('Perfil não encontrado');

      if (isNew) {
        // Create Client
        const { data: client, error: clientErr } = await supabase
          .from('clients')
          .insert({ company_id: profile.company_id, name: clientName || 'Cliente Balcão', phone: clientPhone })
          .select().single();
        if (clientErr) throw clientErr;

        // Create Device
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

        // Create Order
        const { error: orderErr } = await supabase
          .from('orders')
          .insert({
            company_id: profile.company_id,
            client_id: client.id,
            device_id: device.id,
            display_id: 'OS-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
            reported_problem: problemDescription || technicalDiagnosis || 'Sem descrição',
            technical_diagnosis: technicalDiagnosis,
            internal_notes: internalNotes,
            status: status,
            finance_summary: finance
          });
        if (orderErr) throw orderErr;

        navigate('/dashboard/orders');
      } else {
        // Update Order
        const { error } = await supabase
          .from('orders')
          .update({
            status: status,
            reported_problem: problemDescription,
            technical_diagnosis: technicalDiagnosis,
            internal_notes: internalNotes,
            finance_summary: finance
          })
          .eq('id', id);
        
        if (error) throw error;

        // Auto add to finance if Entregue
        if (status === 'Entregue') {
          const totalValue = (Number(finance.parts || 0) + Number(finance.labor || 0)) - Number(finance.discount || 0);
          if (totalValue > 0) {
            const { data: existingFinance } = await supabase
              .from('finance')
              .select('id')
              .eq('order_id', id)
              .maybeSingle();

            if (!existingFinance) {
              await supabase.from('finance').insert({
                company_id: profile.company_id,
                order_id: id,
                type: 'income',
                description: `Recebimento OS-${orderData?.display_id || id.split('-')[0]}`,
                amount: totalValue,
                status: 'paid',
                due_date: new Date().toISOString().split('T')[0],
                paid_date: new Date().toISOString()
              });
            }
          }
        }

        alert('OS atualizada com sucesso!');
        fetchOrder();
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar OS: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalFinance = (Number(finance.parts) + Number(finance.labor)) - Number(finance.discount);

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Carregando detalhes da OS...</div>;
  }

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
                {isNew ? 'Nova Ordem de Serviço' : `OS-${orderData?.display_id || id?.split('-')[0]}`}
              </h1>
              {!isNew && (
                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                  {status}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {isNew ? 'Preencha os dados abaixo' : `Criada em ${new Date(orderData?.created_at).toLocaleDateString('pt-BR')}`}
            </p>
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
             <Save className="w-4 h-4" /> {loading ? 'Salvando...' : (isNew ? 'Criar OS' : 'Atualizar OS')}
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
              { id: 'obs', label: 'Observações Internas', icon: MessageSquare },
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
              <div className="space-y-8 animate-fade-in">
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
                          disabled={!isNew}
                          placeholder="Ex: João da Silva"
                          className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
                        <input 
                          type="text" 
                          value={clientPhone}
                          onChange={e => setClientPhone(e.target.value)}
                          disabled={!isNew}
                          placeholder="(11) 99999-9999"
                          className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all disabled:opacity-60"
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
                          disabled={!isNew}
                          placeholder="Ex: iPhone 13 Pro Max"
                          className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all disabled:opacity-60"
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
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" /> Composição do Valor
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Valor Peças (R$)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={finance.parts}
                      onChange={e => setFinance({...finance, parts: parseFloat(e.target.value) || 0})}
                      className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Mão de Obra (R$)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={finance.labor}
                      onChange={e => setFinance({...finance, labor: parseFloat(e.target.value) || 0})}
                      className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Desconto (R$)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={finance.discount}
                      onChange={e => setFinance({...finance, discount: parseFloat(e.target.value) || 0})}
                      className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all text-red-600"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-[#E5E5E5] flex justify-between items-center mt-6">
                  <span className="font-medium text-gray-500">Valor Total da O.S.</span>
                  <span className="text-2xl font-bold text-[#1A1A1A]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFinance)}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'obs' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Observações Internas
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Anotações (Não visível para o cliente)</label>
                  <textarea 
                    rows={6} 
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    className="w-full p-3 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] outline-none text-sm transition-all resize-none"
                    placeholder="Deixe anotações, histórico de ligações, ou avisos sobre esse aparelho..."
                  ></textarea>
                </div>
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
                <span>Lembre-se de clicar em "Atualizar OS" acima após mudar o status para salvar no banco de dados.</span>
              </p>
            </div>
          </div>

          {/* Quick Info summary */}
          {!isNew && (
            <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Resumo Financeiro</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Peças</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finance.parts || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Mão de obra</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finance.labor || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Desconto</span>
                  <span className="text-red-500">- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finance.discount || 0)}</span>
                </div>
                <div className="pt-2 border-t border-[#E5E5E5] flex justify-between font-bold text-[#1A1A1A] text-base">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFinance)}</span>
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
