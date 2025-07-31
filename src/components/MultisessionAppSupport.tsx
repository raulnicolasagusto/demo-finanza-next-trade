'use client';

import React from 'react';
import { useSession } from '@clerk/nextjs';

export function MultisessionAppSupport({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  
  // The fragment's key is set to the session ID
  // Every time the session ID changes, the key changes, forcing React to recreate
  // the entire component tree under the fragment and guaranteeing a full rerendering cycle
  return <React.Fragment key={session?.id}>{children}</React.Fragment>;
}