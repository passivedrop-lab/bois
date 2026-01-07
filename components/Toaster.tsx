'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#783410',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#ea580c',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}



