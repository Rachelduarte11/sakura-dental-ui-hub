'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../shared/components/ui/toaster";
import { Toaster as Sonner } from "../shared/components/ui/sonner";
import { TooltipProvider } from "../shared/components/ui/tooltip";
<<<<<<< Updated upstream
=======
import { useAuthStore } from "../shared/stores/authStore";
>>>>>>> Stashed changes
import '../styles/globals.css'

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Sakura Dental</title>
        <meta name="description" content="Sistema de gestión dental" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 
