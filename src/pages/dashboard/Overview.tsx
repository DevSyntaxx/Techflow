import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Wrench, 
  CheckCircle, 
  PackageCheck, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  FileQuestion, 
  UserPlus 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  'Em Análise': 'bg-blue-100 text-blue-700',
  'Aguardando Peça': 'bg-orange-100 text-orange-700',
  'Pronto': 'bg-green-100 text-green-700',
  'Entregue': 'bg-gray-100 text-gray-700',
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    opened: 0,
    inProgress: 0,
    ready: 0,
    delivered: 0,
    revenue: 0,
    profit: 0,
    alerts: {
      waitingParts: 0,
      warranties: 0,
      pendingQuotes: 0,
      openLeads: 0
    },
    recentOrders: [] as any[],
    chartData: [] as any[]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
      if (!profile) return;

      const companyId = profile.company_id;

      // Fetch Orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`*, client:clients(name), device:devices(model)`)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      // Fetch Finance
      const { data: finance } = await supabase
        .from('finance')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'paid');

      // Fetch Leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'novo');

      if (orders && finance && leads) {
        const opened = orders.filter(o => o.status === 'Em Análise').length;
        const inProgress = orders.filter(o => o.status === 'Em Andamento' || o.status === 'Aprovado').length;
        const ready = orders.filter(o => o.status === 'Pronto').length;
        const delivered = orders.filter(o => o.status === 'Entregue').length;
        const waitingParts = orders.filter(o => o.status === 'Aguardando Peça').length;
        const pendingQuotes = orders.filter(o => o.status === 'Orçamento').length;

        const income = finance.filter(f => f.type === 'income').reduce((acc, f) => acc + Number(f.amount), 0);
        const expense = finance.filter(f => f.type === 'expense').reduce((acc, f) => acc + Number(f.amount), 0);
        const profit = income - expense;

        // Mock chart data to show some visual even if it's new
        const chartData = [
          { name: 'Sem 1', faturamento: income > 0 ? income * 0.2 : 1200 },
          { name: 'Sem 2', faturamento: income > 0 ? income * 0.5 : 2100 },
          { name: 'Sem 3', faturamento: income > 0 ? income * 0.8 : 1800 },
          { name: 'Sem 4', faturamento: income > 0 ? income : 3200 },
        ];

        setData({
          opened,
          inProgress,
          ready,
          delivered,
          revenue: income,
          profit: profit,
          alerts: {
            waitingParts,
            warranties: 0, // Mock for now until warranties module is fully used
            pendingQuotes,
            openLeads: leads.length
          },
          recentOrders: orders.slice(0, 5),
          chartData
        });
      }

    } catch (error) {
      console.error("Erro ao buscar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Em Análise', value: data.opened, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Na Bancada', value: data.inProgress, icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Prontas (Avisar)', value: data.ready, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Entregues (Total)', value: data.delivered, icon: PackageCheck, color: 'text-[#1A1A1A]', bg: 'bg-gray-100' },
  ];

  const financialStats = [
    { title: 'Receitas (Total)', value: formatMoney(data.revenue), icon: TrendingUp, trend: '+15%' },
    { title: 'Lucro Líquido', value: formatMoney(data.profit), icon: DollarSign, trend: '+8%' },
  ];

  const alerts = [
    { title: 'Aguardando Peça', count: data.alerts.waitingParts, icon: AlertCircle, color: 'text-red-500' },
    { title: 'Garantias Acionadas', count: data.alerts.warranties, icon: Clock, color: 'text-orange-500' },
    { title: 'Orçamentos Pendentes', count: data.alerts.pendingQuotes, icon: FileQuestion, color: 'text-blue-500' },
    { title: 'Leads em Aberto', count: data.alerts.openLeads, icon: UserPlus, color: 'text-purple-500' },
  ];

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando painel...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Visão Geral</h1>
          <p className="text-gray-500 text-sm">Acompanhe os principais indicadores da sua assistência.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link to="/dashboard/clients/new" className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
             Novo Cliente
          </Link>
          <Link to="/dashboard/os/new" className="bg-[#1A1A1A] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center gap-1">
            <span className="text-[#D4AF37]">+</span> Nova Ordem
          </Link>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl card-border premium-shadow">
            <div className="flex items-center justify-between mb-4">
               <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Financials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {financialStats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl card-border premium-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Faturamento Recente</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                    itemStyle={{ color: '#1A1A1A', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="faturamento" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorFaturamento)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Recent Orders */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Atenção Necessária</h3>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#E5E5E5] hover:bg-[#F5F5F7] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <alert.icon className={`w-5 h-5 ${alert.color}`} />
                    <span className="font-medium text-sm">{alert.title}</span>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {alert.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl card-border premium-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Últimas O.S.</h3>
              <Link to="/dashboard/os" className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver todas</Link>
            </div>
            <div className="space-y-4">
              {data.recentOrders.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-4">Nenhuma ordem criada ainda.</p>
              ) : (
                data.recentOrders.map((order, i) => (
                  <Link to={`/dashboard/os/${order.id}`} key={i} className="flex items-center justify-between border-b border-[#E5E5E5] last:border-0 pb-4 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-[#1A1A1A]">OS-{order.display_id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{order.client?.name} • {order.device?.model}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
