# 🔄 Guía de Migración - Arquitectura Basada en Features

## 📋 Resumen de Cambios

Tu proyecto ha sido reorganizado con **arquitectura basada en features**. Aquí está cómo migrar tu código existente.

## 🔧 Cambios en Imports

### **Antes (Estructura Anterior):**
```typescript
// Stores
import { usePatientStore } from '@/shared/stores/patientStore';
import { useServiceStore } from '@/shared/stores/serviceStore';
import { useAuthStore } from '@/shared/stores/authStore';

// APIs
import { patientApi } from '@/shared/utils/api-client';
import { serviceApi } from '@/shared/utils/api-client';

// Types
import type { Patient } from '@/shared/types';
import type { Service } from '@/shared/types';
```

### **Después (Nueva Estructura):**
```typescript
// Features completas
import { usePatientStore, patientApi, PatientList } from '@/features/patients';
import { useServiceStore, serviceApi } from '@/features/services';
import { useAuthStore, authApi } from '@/features/auth';

// Tipos específicos
import type { Patient } from '@/features/patients';
import type { Service } from '@/features/services';
import type { User } from '@/features/auth';
```

## 🚀 Ejemplos de Migración

### **1. Migrar Componente de Pacientes**

**Antes:**
```typescript
// src/app/patients/page.tsx
import { usePatientStore } from '@/shared/stores/patientStore';
import { PatientManagement } from '@/features/patients/components/PatientManagement';

export default function PatientsPage() {
  const { patients, fetchPatients } = usePatientStore();
  
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
  return <PatientManagement />;
}
```

**Después:**
```typescript
// src/app/patients/page.tsx
import { usePatients, PatientList } from '@/features/patients';

export default function PatientsPage() {
  const { patients, isLoading, handleCreatePatient } = usePatients();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Pacientes</h1>
      <PatientList 
        onAddPatient={handleCreatePatient}
        onPatientSelect={(patient) => console.log(patient)}
      />
    </div>
  );
}
```

### **2. Migrar Componente de Servicios**

**Antes:**
```typescript
// src/app/services/page.tsx
import { useServiceStore } from '@/shared/stores/serviceStore';
import { ServiceManagement } from '@/features/services/view/ServiceManagement';

export default function ServicesPage() {
  const { services, fetchServices } = useServiceStore();
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  return <ServiceManagement />;
}
```

**Después:**
```typescript
// src/app/services/page.tsx
import { useServiceStore } from '@/features/services';

export default function ServicesPage() {
  const { services, isLoading, fetchServices } = useServiceStore();
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Servicios</h1>
      {isLoading ? (
        <div>Cargando servicios...</div>
      ) : (
        <div>
          {services.map(service => (
            <div key={service.service_id}>{service.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### **3. Migrar Componente de Autenticación**

**Antes:**
```typescript
// src/app/login/page.tsx
import { useAuthStore } from '@/shared/stores/authStore';
import { LoginScreen } from '@/features/auth/components/LoginScreen';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  
  return <LoginScreen onLogin={login} isLoading={isLoading} />;
}
```

**Después:**
```typescript
// src/app/login/page.tsx
import { useAuthStore } from '@/features/auth';

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Iniciar Sesión</h2>
        {/* Tu formulario de login aquí */}
      </div>
    </div>
  );
}
```

## 📁 Estructura de Archivos Migrada

### **Archivos que ya NO necesitas:**
```
src/shared/stores/patientStore.ts     ❌ (migrado a features/patients/store/)
src/shared/stores/serviceStore.ts     ❌ (migrado a features/services/store/)
src/shared/stores/authStore.ts        ❌ (migrado a features/auth/store/)
```

### **Archivos que SÍ necesitas mantener:**
```
src/shared/utils/api-client.ts        ✅ (cliente centralizado)
src/config/api.ts                     ✅ (configuración de endpoints)
src/shared/components/ui/             ✅ (componentes UI compartidos)
```

## 🔄 Pasos para Migrar tu Código

### **Paso 1: Actualizar Imports**
```bash
# Buscar todos los imports antiguos
grep -r "from '@/shared/stores/" src/
grep -r "from '@/shared/types'" src/
```

### **Paso 2: Reemplazar Imports**
```typescript
// Reemplazar
import { usePatientStore } from '@/shared/stores/patientStore';
// Por
import { usePatientStore } from '@/features/patients';
```

### **Paso 3: Usar Nuevos Hooks**
```typescript
// En lugar de usar el store directamente
const { patients, fetchPatients } = usePatientStore();

// Usar el hook personalizado
const { patients, isLoading, handleCreatePatient } = usePatients();
```

### **Paso 4: Actualizar Componentes**
```typescript
// Usar los nuevos componentes de features
import { PatientList } from '@/features/patients';
import { ServiceList } from '@/features/services';
```

## ✅ Checklist de Migración

- [ ] **Actualizar imports de stores**
- [ ] **Actualizar imports de tipos**
- [ ] **Usar hooks personalizados cuando sea posible**
- [ ] **Actualizar componentes para usar nueva estructura**
- [ ] **Eliminar imports no utilizados**
- [ ] **Probar funcionalidad después de migración**

## 🎯 Beneficios de la Migración

### **✅ Código más limpio:**
```typescript
// Antes: Múltiples imports
import { usePatientStore } from '@/shared/stores/patientStore';
import { patientApi } from '@/shared/utils/api-client';
import type { Patient } from '@/shared/types';

// Después: Un solo import
import { usePatients, patientApi, type Patient } from '@/features/patients';
```

### **✅ Mejor organización:**
- Cada feature tiene su propia carpeta
- Fácil encontrar funcionalidad relacionada
- Separación clara de responsabilidades

### **✅ Desarrollo más rápido:**
- Hooks personalizados listos para usar
- Componentes reutilizables
- Patrones consistentes

## 🚨 Notas Importantes

### **1. Compatibilidad:**
- Los stores antiguos siguen funcionando temporalmente
- Puedes migrar gradualmente
- No hay breaking changes inmediatos

### **2. Testing:**
- Prueba cada componente después de migrar
- Verifica que las funcionalidades sigan funcionando
- Revisa la consola por errores de import

### **3. Performance:**
- Los nuevos hooks optimizan re-renders
- Mejor separación de estado
- Carga más eficiente de datos

## 🎉 ¡Migración Completada!

Una vez que hayas migrado todos los imports, tu proyecto tendrá:
- ✅ **Arquitectura limpia** y organizada
- ✅ **Código más mantenible**
- ✅ **Desarrollo más eficiente**
- ✅ **Escalabilidad mejorada**

**¡Tu proyecto está listo para el siguiente nivel!** 