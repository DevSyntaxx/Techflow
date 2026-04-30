import React, { useState } from 'react';
import { Save, Building2, Palette, Shield, Link as LinkIcon, Camera, MapPin, Briefcase, CreditCard } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Configurações da Empresa</h1>
          <p className="text-gray-500 text-sm">Personalize a identidade e regras da sua assistência.</p>
        </div>
        <button className="bg-[#1A1A1A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
          <Save className="w-4 h-4" /> Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1">
          <nav className="flex flex-col gap-2">
            {[
              { id: 'perfil', label: 'Perfil da Assistência', icon: Building2 },
              { id: 'marca', label: 'Marca e Cores', icon: Palette },
              { id: 'garantia', label: 'Termos de Garantia', icon: Shield },
              { id: 'financeiro', label: 'Dados Financeiros', icon: CreditCard },
              { id: 'links', label: 'Links Públicos', icon: LinkIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${
                  activeTab === tab.id
                  ? 'bg-white text-[#1A1A1A] card-border premium-shadow'
                  : 'text-gray-500 hover:bg-white hover:text-[#1A1A1A]'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl card-border premium-shadow p-6 sm:p-8">
            
            {activeTab === 'perfil' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6 pb-6 border-b border-[#E5E5E5]">
                  <div className="w-24 h-24 rounded-2xl bg-[#F5F5F7] border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors group">
                    <Camera className="w-6 h-6 mb-1 group-hover:text-[#1A1A1A] transition-colors" />
                    <span className="text-xs font-medium">Trocar Logo</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Logomarca</h3>
                    <p className="text-sm text-gray-500">Recomendado: 512x512px. PNG ou JPG.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4 sm:col-span-2">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                      <Briefcase className="w-4 h-4 text-[#D4AF37]" /> Informações Básicas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Nome da Assistência</label>
                        <input type="text" defaultValue="CM Place" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">CNPJ (Opcional)</label>
                        <input type="text" placeholder="00.000.000/0001-00" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp de Contato</label>
                        <input type="text" defaultValue="(11) 99999-9999" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">E-mail Comercial</label>
                        <input type="email" defaultValue="contato@cmplace.com.br" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:col-span-2">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-[#E5E5E5] pb-2 mt-4">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" /> Localização e Horários
                    </h4>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Endereço Completo</label>
                      <input type="text" placeholder="Rua, Número, Bairro" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all mb-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Cidade</label>
                        <input type="text" placeholder="Sua Cidade" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                        <input type="text" placeholder="UF" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Horário de Atendimento</label>
                      <input type="text" defaultValue="Seg à Sex: 09h às 18h | Sáb: 09h às 13h" className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marca' && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg mb-2">Identidade Visual</h3>
                <p className="text-sm text-gray-500 mb-6">Personalize as cores que aparecerão na página pública para seus clientes.</p>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Cor Principal (Primária)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37] border border-gray-200 premium-shadow"></div>
                    <input type="text" defaultValue="#D4AF37" className="w-32 p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-center font-mono uppercase" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Usada em botões e destaques na sua página pública.</p>
                </div>
              </div>
            )}

            {activeTab === 'garantia' && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg mb-2">Padrões de Garantia</h3>
                <p className="text-sm text-gray-500 mb-6">Estes termos serão inseridos automaticamente nos certificados digitais gerados.</p>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prazo Padrão (Dias)</label>
                  <input type="number" defaultValue="90" className="w-32 p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Termos e Condições Padrão</label>
                  <textarea rows={8} className="w-full p-3 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all resize-y" defaultValue={`1. Esta garantia cobre estritamente os defeitos de fabricação referentes à(s) peça(s) substituída(s) ou ao(s) serviço(s) prestado(s) e descritos neste documento.

2. A garantia perderá imediatamente sua validade em casos de:
- Quedas, amassados, trincas ou danos físicos.
- Contato com líquidos, umidade ou oxidação.
- Sinais de abertura ou tentativa de reparo por terceiros.
- Uso de carregadores falsificados.

3. Para acionar a garantia, é obrigatória a apresentação deste termo.`}></textarea>
                </div>
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="flex h-64 items-center justify-center text-gray-400 flex-col gap-2">
                <CreditCard className="w-8 h-8 opacity-50" />
                <p>Configuração de Chave Pix para recebimentos.</p>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg mb-2">Página Pública da Assistência</h3>
                <p className="text-sm text-gray-500 mb-6">Configure o endereço (URL) da sua página comercial do TechFlow.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL (Slug)</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 border border-[#E5E5E5] border-r-0 text-gray-500 px-4 py-2.5 rounded-l-lg text-sm">techflow.com.br/</span>
                    <input type="text" defaultValue="cmplace" className="w-full p-2.5 bg-[#F5F5F7] border border-[#E5E5E5] rounded-r-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all font-medium text-[#1A1A1A]" />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5E5E5]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link de Avaliação (Google Meu Negócio)</label>
                  <input type="url" placeholder="https://g.page/r/..." className="w-full p-2.5 bg-[#F5F5F7] border border-transparent rounded-lg focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" />
                  <p className="text-xs text-gray-500 mt-2">Enviaremos este link automaticamente pedindo 5 estrelas quando a OS for entregue com sucesso.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
