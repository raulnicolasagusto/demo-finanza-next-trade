'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import Sidebar from './Sidebar';
import SharedExpenseNotifications from './SharedExpenseNotifications';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onExpenseUpdate?: () => void;
}

export default function DashboardLayout({ children, onExpenseUpdate }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
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