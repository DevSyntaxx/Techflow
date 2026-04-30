import React from 'react';
import { useParams } from 'react-router-dom';
import { Smartphone, Clock, CheckCircle, MessageCircle, AlertCircle, Wrench, PackageCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPublicData = {
  shopName: 'CM Place',
  shopLogo: 'CM',
  shopWhatsapp: '5511999999999',
  token: 'OS-0042',
  clientName: 'J*** S***',
  device: 'iPhone 13 Pro',
  reportedProblem: 'Aparelho parou de carregar de repente. Tentativa com 2 cabos diferentes sem sucesso.',
  status: 'Aguardando Peça',
  estimate: '28/04/2026',
  publicNotes: 'Foi identificado um curto no conector de carga. A peça já foi encomendada e deve chegar até amanhã.',
  timeline: [
    { status: 'OS Criada', date: 'Hoje, 10:30', desc: 'Aparelho recebido na loja.', done: true },
    { status: 'Em Análise', date: 'Hoje, 11:15', desc: 'Iniciada análise técnica do problema.', done: true },
    { status: 'Aprovado', date: 'Hoje, 14:00', desc: 'Orçamento aprovado pelo cliente.', done: true },
    { status: 'Aguardando Peça', date: 'Hoje, 14:30', desc: 'Peça encomendada com o fornecedor.', done: true },
    { status: 'Em Reparo', date: '-', desc: 'Execução do serviço pelo técnico.', done: false },
    { status: 'Pronto para Retirada', date: '-', desc: 'Aparelho pronto e testado.', done: false }
  ]
};

const getStatusConfig = (status: string) => {
  switch(status) {
    case 'Recebido': return { color: 'text-gray-500', bg: 'bg-gray-100', icon: AlertCircle };
    case 'Em Análise': return { color: 'text-blue-500', bg: 'bg-blue-100', icon: Wrench };
    case 'Aguardando Peça': return { color: 'text-orange-500', bg: 'bg-orange-100', icon: Clock };
    case 'Pronto para Retirada': return { color: 'text-green-500', bg: 'bg-green-100', icon: PackageCheck };
    default: return { color: 'text-[#1A1A1A]', bg: 'bg-gray-100', icon: CheckCircle };
  }
};

const PublicTracking = () => {
  const { token } = useParams();
  const config = getStatusConfig(mockPublicData.status);
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header / Brand */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center premium-shadow mb-4">
            <span className="text-white font-bold text-xl">{mockPublicData.shopLogo}</span>
          </div>
          <h1 className="text-xl font-bold">{mockPublicData.shopName}</h1>
          <p className="text-sm text-gray-500">Acompanhamento de Reparo</p>
        </div>

        {/* Main Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 card-border premium-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.bg} mb-4`}>
              <StatusIcon className={`w-10 h-10 ${config.color}`} />
            </div>
            <h2 className="text-3xl font-black mb-2">{mockPublicData.status}</h2>
            <p className="text-gray-500 font-medium">Sua O.S. está sendo cuidada com atenção.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F5F5F7] p-4 rounded-2xl">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Código</p>
              <p className="font-bold text-lg">{token || mockPublicData.token}</p>
            </div>
            <div className="bg-[#F5F5F7] p-4 rounded-2xl">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Previsão
              </p>
              <p className="font-bold text-lg">{mockPublicData.estimate}</p>
            </div>
          </div>

          <div className="bg-[#F5F5F7] p-4 rounded-2xl space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> Aparelho
              </p>
              <p className="font-medium">{mockPublicData.device}</p>
            </div>
            <div className="border-t border-[#E5E5E5] pt-4">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Problema Relatado</p>
              <p className="text-sm text-gray-600 leading-relaxed">{mockPublicData.reportedProblem}</p>
            </div>
            {mockPublicData.publicNotes && (
               <div className="border-t border-[#E5E5E5] pt-4">
               <p className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider mb-1">Observação da Assistência</p>
               <p className="text-sm font-medium leading-relaxed">{mockPublicData.publicNotes}</p>
             </div>
            )}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 card-border premium-shadow"
        >
          <h3 className="font-bold text-lg mb-6 border-b border-[#E5E5E5] pb-4">Linha do Tempo</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#E5E5E5]">
            {mockPublicData.timeline.map((step, i) => (
              <div key={i} className={`relative flex items-start group ${step.done ? '' : 'opacity-40'}`}>
                <div className={`flex flex-col items-center justify-center w-5 h-5 rounded-full border-2 bg-white shrink-0 mt-0.5 
                  ${step.done ? 'border-[#1A1A1A]' : 'border-gray-300'}
                `}>
                  {step.done && <div className="w-2 h-2 rounded-full bg-[#1A1A1A]"></div>}
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold text-sm ${step.done ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                    {step.status}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mb-1">{step.date}</p>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <a 
            href={`https://wa.me/${mockPublicData.shopWhatsapp}?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20a%20OS%20${token || mockPublicData.token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-colors premium-shadow"
          >
            <MessageCircle className="w-6 h-6" /> Falar com o Suporte
          </a>
          <p className="text-center text-xs text-gray-400 mt-4">
            Em nome de segurança, não exibimos valores ou dados pessoais nesta tela pública.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicTracking;
