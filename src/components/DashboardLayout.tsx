'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Sidebar from './Sidebar';
import SharedExpenseNotifications from './SharedExpenseNotifications';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onExpenseUpdate?: () => void;
}

export default function DashboardLayout({ children, onExpenseUpdate }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Cargar el estado del sidebar desde localStorage al montar el componente
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);
  
  // Función para manejar el cambio de estado del sidebar
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  };
  
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/transacciones':
        return 'Transacciones';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        key="persistent-sidebar" 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={handleSidebarToggle} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            <div className="flex items-center space-x-4">
              <SharedExpenseNotifications onExpenseUpdate={onExpenseUpdate} />
              <span className="text-sm text-gray-600">Bienvenido</span>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8'
                  }
                }}
                afterSignOutUrl="/sign-in"
                showName={true}
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
              />
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}