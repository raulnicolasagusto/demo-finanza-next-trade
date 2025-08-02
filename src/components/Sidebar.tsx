'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, Home, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

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
      <div className="flex items-center justify-center p-4">
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
      <nav className="flex-1 px-2 mt-8">
        <ul className={`${isCollapsed ? 'space-y-6' : 'grid grid-cols-2 gap-4'}`}>
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

      {/* Bottom section for premium card */}
      <div className="p-4 mt-auto">
        {!isCollapsed && (
          <motion.div 
            className="bg-indigo-500 rounded-xl p-4 text-white"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold mb-1">Get a premium card</h3>
            <p className="text-xs text-indigo-100 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            <button className="bg-white text-indigo-600 text-sm font-medium px-4 py-2 rounded-lg">
              Get Now
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}