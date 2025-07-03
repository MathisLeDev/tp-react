import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserCheck, 
  FileText, 
  Settings,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import DashboardHome from '../components/dashboard/DashboardHome';
import FilieresManagement from '../components/dashboard/FilieresManagement';
import PromotionsManagement from '../components/dashboard/PromotionsManagement';
import ApprenantsManagement from '../components/dashboard/ApprenantsManagement';
import PersonnelManagement from '../components/dashboard/PersonnelManagement';
import CandidaturesManagement from '../components/dashboard/CandidaturesManagement';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Filières', href: '/admin/filieres', icon: BookOpen },
    { name: 'Promotions', href: '/admin/promotions', icon: Users },
    { name: 'Apprenants', href: '/admin/apprenants', icon: UserCheck },
    { name: 'Personnel', href: '/admin/personnel', icon: Users },
    { name: 'Candidatures', href: '/admin/candidatures', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-64 dashboard-sidebar">
          <div className="flex items-center justify-between p-4 border-b border-blue-600">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-white mr-2" />
              <h1 className="text-xl font-bold text-white">Admin</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-700 text-white border-r-4 border-blue-300'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 dashboard-sidebar">
        <div className="flex items-center p-6 border-b border-blue-600">
          <GraduationCap className="h-8 w-8 text-white mr-3" />
          <h1 className="text-xl font-bold text-white">Administration</h1>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-700 text-white border-r-4 border-blue-300'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Retour au site
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/filieres" element={<FilieresManagement />} />
            <Route path="/promotions" element={<PromotionsManagement />} />
            <Route path="/apprenants" element={<ApprenantsManagement />} />
            <Route path="/personnel" element={<PersonnelManagement />} />
            <Route path="/candidatures" element={<CandidaturesManagement />} />
          </Routes>
        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;