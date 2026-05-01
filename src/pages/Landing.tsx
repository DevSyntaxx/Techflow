import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Wrench, Smartphone, FileText, CheckCircle, Clock, Shield, BarChart3, MessageCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight">TechFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#1A1A1A] transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">Como funciona</a>
            <a href="#pricing" className="hover:text-[#1A1A1A] transition-colors">Planos</a>
            <a href="#faq" className="hover:text-[#1A1A1A] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:text-[#D4AF37] transition-colors">Entrar</Link>
            <Link to="/auth?signup=true" className="text-sm font-medium bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors premium-shadow">
              Começar agora
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white card-border mb-8 text-sm font-medium text-gray-600 premium-shadow">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              O ecossistema completo para assistências técnicas modernas
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-8 leading-tight">
              Organize sua assistência técnica em um painel <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-600">premium e profissional.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Controle clientes, aparelhos, ordens de serviço, orçamentos, garantias, estoque e financeiro sem depender de planilhas ou conversas perdidas no WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?signup=true" className="w-full sm:w-auto text-base font-medium bg-[#1A1A1A] text-white px-8 py-4 rounded-full hover:bg-black transition-all transform hover:scale-105 premium-shadow flex items-center justify-center gap-2">
                Começar agora <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto text-base font-medium bg-white text-[#1A1A1A] px-8 py-4 rounded-full hover:bg-gray-50 transition-all card-border premium-shadow flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Ver demonstração
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] via-transparent to-transparent z-10"></div>
            <div className="rounded-2xl overflow-hidden premium-shadow card-border bg-white p-2">
              <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center relative">
                {/* Mockup Dashboard Placeholder */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="z-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl premium-shadow text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" />
                  <p className="font-semibold text-lg">TechFlow Dashboard</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Modules Section */}
        <section id="features" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que sua assistência precisa</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">Um ecossistema modular pensado para simplificar o seu dia a dia.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: FileText, title: 'Ordens de Serviço', desc: 'Controle de ponta a ponta com status em tempo real e tokens públicos para clientes.' },
                { icon: Smartphone, title: 'Gestão de Aparelhos', desc: 'Histórico completo de manutenções, defeitos e acessórios de cada dispositivo.' },
                { icon: Shield, title: 'Garantias Digitais', desc: 'Gere garantias com QR Code e controle de prazos automaticamente.' },
                { icon: MessageCircle, title: 'Integração WhatsApp', desc: 'Mensagens automáticas prontas para enviar orçamentos e atualizar status.' },
                { icon: BarChart3, title: 'Financeiro Inteligente', desc: 'Controle de receitas, despesas, fluxo de caixa e lucro estimado por serviço.' },
                { icon: Clock, title: 'Agenda e Lembretes', desc: 'Organize coletas, entregas e retornos de garantia de forma simples.' },
              ].map((mod, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#F5F5F7] hover:bg-white transition-colors duration-300 card-border hover:premium-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 card-border group-hover:scale-110 transition-transform">
                    <mod.icon className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{mod.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-24 bg-[#1A1A1A] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Pronto para profissionalizar sua operação?</h2>
            <p className="text-xl text-gray-400 mb-10">Junte-se a centenas de assistências que já transformaram seus negócios com o TechFlow.</p>
            <Link to="/auth?signup=true" className="inline-flex items-center gap-2 text-lg font-medium bg-[#D4AF37] text-white px-8 py-4 rounded-full hover:bg-yellow-500 transition-all transform hover:scale-105 premium-shadow">
              Criar conta gratuitamente <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-[#1A1A1A] flex items-center justify-center">
              <Wrench className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">TechFlow</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 TechFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
