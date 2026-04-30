import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Smartphone, 
  Package, 
  Truck, 
  DollarSign, 
  Calendar, 
  Target, 
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Shield
} from 'lucide-react';

const navItems = [
  { name: 'Visão Geral', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Ordens de Serviço', path: '/dashboard/orders', icon: FileText },
  { name: 'Garantias', path: '/dashboard/warranties', icon: Shield },
  { name: 'Clientes', path: '/dashboard/clients', icon: Users },
  { name: 'Aparelhos', path: '/dashboard/devices', icon: Smartphone },
  { name: 'Estoque', path: '/dashboard/inventory', icon: Package },
  { name: 'Fornecedores', path: '/dashboard/suppliers', icon: Truck },
  { name: 'Financeiro', path: '/dashboard/finance', icon: DollarSign },
  { name: 'Agenda', path: '/dashboard/schedule', icon: Calendar },
  { name: 'Leads (CRM)', path: '/dashboard/leads', icon: Target },
];
const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col md:flex-row text-[#1A1A1A] font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#E5E5E5] px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-xs">TF</span>
          </div>
          <span className="font-semibold text-lg">TechFlow</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#E5E5E5] transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-20 hidden md:flex items-center px-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xs">TF</span>
            </div>
            <span className="font-bold text-xl tracking-tight">TechFlow</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Principal</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                  ? 'bg-[#1A1A1A] text-white premium-shadow' 
                  : 'text-gray-500 hover:bg-[#F5F5F7] hover:text-[#1A1A1A]'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-8">
             <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Administração</p>
             <Link
                to="/dashboard/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  location.pathname.startsWith('/dashboard/settings')
                  ? 'bg-[#1A1A1A] text-white premium-shadow' 
                  : 'text-gray-500 hover:bg-[#F5F5F7] hover:text-[#1A1A1A]'
                }`}
              >
                <Settings className={`w-5 h-5 ${location.pathname.startsWith('/dashboard/settings') ? 'text-[#D4AF37]' : ''}`} />
                Configurações
              </Link>
          </div>
        </div>

        <div className="p-4 border-t border-[#E5E5E5]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm">
              CM
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">CM Place</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5] hidden md:flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar clientes, O.S. ou aparelhos..." 
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-transparent rounded-lg focus:bg-white focus:border-[#E5E5E5] focus:ring-2 focus:ring-[#1A1A1A] focus:outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-[#1A1A1A] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-[#E5E5E5]"></div>
            <Link to="/dashboard/orders/new" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors premium-shadow">
              + Nova Ordem
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F5F5F7]">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
