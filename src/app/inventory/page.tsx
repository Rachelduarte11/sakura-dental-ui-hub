'use client'

import InventoryManagement from '../../features/inventory/components/InventoryManagement'
import AppLayout from '../../shared/components/AppLayout'
import { useRouter } from 'next/navigation'

export default function InventoryPage() {
  const router = useRouter();

  return (
    <AppLayout 
      currentScreen="inventory" 
      onNavigate={(screen) => router.push(`/${screen}`)}
      title="Gestión de Inventario"
    >
      <InventoryManagement />
    </AppLayout>
  );
} 
