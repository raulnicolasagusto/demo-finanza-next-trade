'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, Home, ArrowLeftRight, Settings, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Transacciones',
      href: '/transacciones',
      icon: ArrowLeftRight,
      current: pathname === '/transacciones'
    },
    {
      name: 'Configuración',
      href: '/configuracion',
      icon: Settings,
      current: pathname === '/configuracion'
    }
  ];

  return (
    <motion.div 
      className="bg-white shadow-lg h-full flex flex-col"
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header with Menu Toggle */}
      <div className="flex items-center justify-center p-4 border-b">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center p-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!isCollapsed && (
          <motion.span 
            className="ml-2 text-lg font-semibold text-gray-900"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            Personal Capital
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-2">
        <ul className={`${isCollapsed ? 'space-y-2' : 'grid grid-cols-2 gap-2'}`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex flex-col items-center justify-center p-3 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    item.current ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Icon
                      className={`w-5 h-5 ${
                        item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                  </div>
                  {!isCollapsed && (
                    <motion.span 
                      className="text-xs text-center"
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section for dark mode toggle */}
      <div className="p-4 mt-auto">
        {!isCollapsed && (
          <motion.div 
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Moon className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Dark Mood</span>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <motion.span
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out"
                  animate={{
                    x: isDarkMode ? 24 : 4
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

    