'use client'

import * as React from 'react'
import { useSignIn, useClerk } from '@clerk/nextjs'

export default function CustomGoogleAuth() {
  const { signIn } = useSignIn()
  const { signOut } = useClerk()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleGoogleSignIn = async () => {
    if (!signIn) return

    setIsLoading(true)
    try {
      // First, ensure any existing session is cleared
      await signOut({ sessionId: undefined })
      
      // Small delay to ensure signOut completes
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Use authenticateWithRedirect with additional parameters to encourage account selection
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sign-in/sso-callback',
        redirectUrlComplete: '/dashboard',
        // Additional OAuth scopes that might help with account switching
        additionalOAuthScopes: ['email', 'profile', 'openid'],
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </button>
      
      <div className="text-xs text-gray-500 text-center">
        <p>💡 <strong>Tip:</strong> If you need to switch Google accounts:</p>
        <p>1. Clear your browser cookies for this site</p>
        <p>2. Or open an incognito/private window</p>
        <p>3. Or <a 
          href="https://accounts.google.com/AccountChooser" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          visit Google Account Chooser
        </a> first</p>
      </div>
    </div>
  )
}