import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import PublicTracking from './pages/PublicTracking';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/dashboard/Overview';
import Orders from './pages/dashboard/Orders';
import OrderDetails from './pages/dashboard/OrderDetails';
import Clients from './pages/dashboard/Clients';
import ClientDetails from './pages/dashboard/ClientDetails';
import Finance from './pages/dashboard/Finance';
import Inventory from './pages/dashboard/Inventory';
import Warranties from './pages/dashboard/Warranties';
import WarrantyDetails from './pages/dashboard/WarrantyDetails';
import Settings from './pages/dashboard/Settings';
import Devices from './pages/dashboard/Devices';
import Suppliers from './pages/dashboard/Suppliers';
import Schedule from './pages/dashboard/Schedule';
import Leads from './pages/dashboard/Leads';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/os/:token" element={<PublicTracking />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderDetails />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientDetails />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="finance" element={<Finance />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="warranties" element={<Warranties />} />
          <Route path="warranties/new" element={<WarrantyDetails />} />
          <Route path="warranties/:id" element={<WarrantyDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="devices" element={<Devices />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="leads" element={<Leads />} />
          <Route path="*" element={<div className="flex h-full items-center justify-center p-8 text-gray-500">Página não encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
