import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { MultisessionAppSupport } from '@/components/MultisessionAppSupport';
import { ThemeProvider } from '@/contexts/ThemeContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Demo Finanza - App de Finanzas",
  description: "Aplicación de gestión financiera con autenticación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{ signIn: { baseTheme: 'dark' } }} 
      allowSignOut={true} 
      signInUrl="/sign-in"
      afterMultiSessionSingleSignOutUrl="/sign-in"
    >
      <html lang="es">
        <MultisessionAppSupport>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </ThemeProvider>
          </body>
        </MultisessionAppSupport>
      </html>
    </ClerkProvider>
  );
}
