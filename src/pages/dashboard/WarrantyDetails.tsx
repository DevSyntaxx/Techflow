import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Share2, ShieldCheck, Download, Smartphone, Calendar, FileText, User } from 'lucide-react';

const WarrantyDetails = () => {
  const { id } = useParams();
  const isNew = !id;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl card-border premium-shadow sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/warranties" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              {isNew ? 'Gerar Nova Garantia' : `Garantia Digital ${id}`}
            </h1>
            <p className="text-gray-500 text-sm">Visualização e impressão de termo.</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {!isNew && (
            <>
              <button className="bg-[#F5F5F7] text-[#1A1A1A] p-2 rounded-lg hover:bg-gray-200 transition-colors" title="Compartilhar WhatsApp">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-[#1A1A1A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
                <Printer className="w-4 h-4" /> Imprimir Termo
              </button>
            </>
          )}
          {isNew && (
            <button className="bg-[#1A1A1A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center justify-center gap-2 w-full sm:w-auto">
              Gerar Garantia
            </button>
          )}
        </div>
      </div>

      {/* Certificate Visual Container */}
      {!isNew ? (
        <div className="bg-white p-8 sm:p-12 rounded-2xl card-border premium-shadow print:shadow-none print:border-none relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
             <ShieldCheck className="w-96 h-96" />
          </div>

          <div className="relative z-10">
            {/* Cert Header */}
            <div className="flex justify-between items-start border-b-2 border-[#1A1A1A] pb-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TF</span>
                  </div>
                  <span className="font-bold text-2xl tracking-tight text-[#1A1A1A]">TechFlow</span>
                </div>
                <p className="text-sm text-gray-500">Assistência Técnica Especializada</p>
                <p className="text-sm text-gray-500">CNPJ: 00.000.000/0001-00</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-wider mb-2">Garantia</h2>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold text-sm tracking-wide">ATIVA VÁLIDA</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><FileText className="w-3 h-3" /> CÓDIGO DA GARANTIA</p>
                <p className="text-lg font-bold text-[#1A1A1A]">{id}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><FileText className="w-3 h-3" /> ORDEM DE SERVIÇO</p>
                <p className="text-lg font-bold text-[#1A1A1A]">OS-0042</p>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><User className="w-3 h-3" /> CLIENTE</p>
                <p className="text-base font-bold text-[#1A1A1A]">João Silva</p>
                <p className="text-sm text-gray-600">CPF: 123.456.789-00</p>
                <p className="text-sm text-gray-600">(11) 98765-4321</p>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><Smartphone className="w-3 h-3" /> APARELHO & SERVIÇO</p>
                <p className="text-base font-bold text-[#1A1A1A]">iPhone 13 Pro (Azul Sierra)</p>
                <p className="text-sm text-gray-600">IMEI: 358123456789012</p>
                <p className="text-sm font-medium text-[#1A1A1A] mt-1 bg-[#F5F5F7] inline-block px-2 py-0.5 rounded">Troca de Tela Frontal Original</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> DATA DE INÍCIO</p>
                <p className="text-base font-bold text-[#1A1A1A]">28/04/2026</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 text-[#D4AF37]"><Calendar className="w-3 h-3" /> DATA DE VENCIMENTO</p>
                <p className="text-base font-bold text-[#D4AF37]">28/07/2026 <span className="text-sm text-gray-500 font-normal">(90 dias)</span></p>
              </div>
            </div>

            {/* Termos */}
            <div className="bg-[#F5F5F7] p-6 rounded-xl border border-[#E5E5E5] mb-12 text-sm text-gray-600 leading-relaxed">
              <h4 className="font-bold text-[#1A1A1A] mb-2 uppercase text-xs">Termos e Condições</h4>
              <p className="mb-2">1. Esta garantia cobre estritamente os defeitos de fabricação referentes à(s) peça(s) substituída(s) ou ao(s) serviço(s) prestado(s) e descritos neste documento.</p>
              <p className="mb-2">2. A garantia perderá imediatamente sua validade em casos de:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Quedas, amassados, trincas ou danos físicos de qualquer natureza.</li>
                <li>Contato com líquidos, umidade ou oxidação (mesmo em aparelhos ditos "à prova d'água").</li>
                <li>Sinais de abertura ou tentativa de reparo por terceiros não autorizados por nossa assistência.</li>
                <li>Uso de carregadores ou acessórios não originais/certificados que causem curto-circuito.</li>
              </ul>
              <p>3. Para acionar a garantia, é obrigatória a apresentação deste termo (digital ou impresso) juntamente com o aparelho.</p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-8">
              <div className="text-center border-t border-gray-300 pt-2">
                <p className="font-bold text-[#1A1A1A] text-sm">TechFlow Assistência</p>
                <p className="text-xs text-gray-500">Assinatura do Técnico / Loja</p>
              </div>
              <div className="text-center border-t border-gray-300 pt-2">
                <p className="font-bold text-[#1A1A1A] text-sm">João Silva</p>
                <p className="text-xs text-gray-500">Assinatura do Cliente</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl card-border premium-shadow flex flex-col items-center justify-center h-64">
           <ShieldCheck className="w-12 h-12 text-gray-300 mb-4" />
           <p className="text-gray-500">Selecione uma Ordem de Serviço finalizada para gerar a garantia digital.</p>
        </div>
      )}
    </div>
  );
};

export default WarrantyDetails;
