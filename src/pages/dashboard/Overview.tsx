import React from 'react';
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

const data = [
  { name: 'Jan', faturamento: 4000 },
  { name: 'Fev', faturamento: 3000 },
  { name: 'Mar', faturamento: 2000 },
  { name: 'Abr', faturamento: 2780 },
  { name: 'Mai', faturamento: 1890 },
  { name: 'Jun', faturamento: 2390 },
  { name: 'Jul', faturamento: 3490 },
];

const stats = [
  { title: 'Ordens Abertas', value: '12', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: 'Em Andamento', value: '8', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Prontas', value: '15', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  { title: 'Entregues (Mês)', value: '45', icon: PackageCheck, color: 'text-[#1A1A1A]', bg: 'bg-gray-100' },
];

const financialStats = [
  { title: 'Faturamento (Mês)', value: 'R$ 14.250,00', icon: TrendingUp, trend: '+12.5%' },
  { title: 'Lucro Estimado', value: 'R$ 6.120,00', icon: DollarSign, trend: '+8.2%' },
];

const alerts = [
  { title: 'Aguardando Peça', count: 3, icon: AlertCircle, color: 'text-red-500' },
  { title: 'Garantias Vencendo', count: 2, icon: Clock, color: 'text-orange-500' },
  { title: 'Orçamentos Pendentes', count: 5, icon: FileQuestion, color: 'text-blue-500' },
  { title: 'Leads em Aberto', count: 7, icon: UserPlus, color: 'text-purple-500' },
];

const recentOrders = [
  { id: 'OS-0042', client: 'João Silva', device: 'iPhone 13 Pro', status: 'Em Análise', date: 'Hoje, 10:30' },
  { id: 'OS-0041', client: 'Maria Oliveira', device: 'Samsung S22', status: 'Aguardando Peça', date: 'Ontem, 16:45' },
  { id: 'OS-0040', client: 'Carlos Santos', device: 'iPad Air 4', status: 'Pronto', date: '28/04/2026' },
  { id: 'OS-0039', client: 'Ana Clara', device: 'iPhone 11', status: 'Entregue', date: '27/04/2026' },
];

const statusColors: Record<string, string> = {
  'Em Análise': 'bg-blue-100 text-blue-700',
  'Aguardando Peça': 'bg-orange-100 text-orange-700',
  'Pronto': 'bg-green-100 text-green-700',
  'Entregue': 'bg-gray-100 text-gray-700',
};

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Visão Geral</h1>
          <p className="text-gray-500 text-sm">Acompanhe os principais indicadores da sua assistência.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
             Novo Cliente
          </button>
          <button className="bg-[#1A1A1A] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow flex items-center gap-1">
            <span className="text-[#D4AF37]">+</span> Nova Ordem
          </button>
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
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Faturamento Mensal</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver todas</button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[#E5E5E5] last:border-0 pb-4 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#1A1A1A]">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{order.client} • {order.device}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{order.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
