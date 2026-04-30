import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Mail, Lock, User, Phone, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsLogin(false);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('E-mail ou senha incorretos.');
      setIsLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') + '-' + Math.floor(Math.random() * 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar usuário.');

      // 2. Create Company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          slug: generateSlug(companyName),
          whatsapp: phone
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Create Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          company_id: company.id,
          full_name: userName,
          role: 'admin'
        });

      if (profileError) throw profileError;

      // Automatically sign in or redirect
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro durante o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#D4AF37] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center premium-shadow">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">TechFlow</span>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin ? 'Faça login para acessar seu painel.' : 'E comece a profissionalizar sua assistência.'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-[#E5E5E5] relative overflow-hidden">
          
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="seu@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-[#1A1A1A] text-white py-3 rounded-xl font-medium hover:bg-black transition-colors premium-shadow disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Entrar no painel <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignup} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nome da Assistência</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="Ex: TechFix Cell" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Seu Nome</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" required value={userName} onChange={e => setUserName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="Nome" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="seu@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6} className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F7] border-transparent rounded-xl focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 outline-none text-sm transition-all" placeholder="Mínimo 6 caracteres" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-[#D4AF37] text-white py-3 mt-6 rounded-xl font-medium hover:bg-yellow-500 transition-colors premium-shadow disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Conta Gratuitamente'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{' '}
              <button 
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} 
                className="font-medium text-[#1A1A1A] hover:text-[#D4AF37] transition-colors"
              >
                {isLogin ? "Criar conta grátis" : "Fazer login"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
