'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, Home, ArrowLeftRight, Settings, Moon, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useTheme();

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
      name: 'Billetera',
      href: '/billetera',
      icon: Wallet,
      current: pathname === '/billetera'
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
      className="bg-white dark:bg-gray-900 shadow-lg h-full flex flex-col transition-colors duration-300"
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header with Menu Toggle */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
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
                      ? 'text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    item.current ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Icon
                      className={`w-5 h-5 ${
                        item.current ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
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
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mood</span>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
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

    