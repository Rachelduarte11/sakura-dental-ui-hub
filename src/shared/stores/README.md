# Stores de Zustand para Sakura Dental

Este directorio contiene todas las stores de Zustand para el manejo del estado global de la aplicación Sakura Dental.

## Estructura

### 1. **authStore.ts** - Autenticación y Usuarios
Maneja la autenticación, usuarios, roles y permisos.

```typescript
import { useAuthStore } from '@/shared/stores';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

**Funcionalidades:**
- Login/Logout
- Gestión de usuarios
- Roles y permisos
- Persistencia de sesión

### 2. **patientStore.ts** - Gestión de Pacientes
Maneja la información de pacientes y datos relacionados.

```typescript
import { usePatientStore } from '@/shared/stores';

const { patients, fetchPatients, createPatient, updatePatient } = usePatientStore();
```

**Funcionalidades:**
- CRUD de pacientes
- Filtros y búsqueda
- Gestión de distritos, géneros y tipos de documento

### 3. **serviceStore.ts** - Servicios y Categorías
Maneja los servicios dentales y sus categorías.

```typescript
import { useServiceStore } from '@/shared/stores';

const { services, categories, fetchServices, createService } = useServiceStore();
```

**Funcionalidades:**
- CRUD de servicios
- Gestión de categorías
- Filtros por categoría

### 4. **quotationStore.ts** - Cotizaciones
Maneja las cotizaciones, items y historias clínicas.

```typescript
import { useQuotationStore } from '@/shared/stores';

const { quotations, createQuotation, addQuotationItem, calculateQuotationTotal } = useQuotationStore();
```

**Funcionalidades:**
- CRUD de cotizaciones
- Gestión de items de cotización
- Historias clínicas
- Cálculo de totales
- Cambio de estados

### 5. **paymentStore.ts** - Pagos y Recibos
Maneja los pagos, métodos de pago y recibos.

```typescript
import { usePaymentStore } from '@/shared/stores';

const { payments, processPayment, generateReceipt, calculateBalance } = usePaymentStore();
```

**Funcionalidades:**
- Procesamiento de pagos
- Gestión de métodos de pago
- Generación de recibos
- Cálculo de balances

### 6. **employeeStore.ts** - Empleados
Maneja la información de empleados y cargos.

```typescript
import { useEmployeeStore } from '@/shared/stores';

const { employees, jobTitles, fetchEmployees, createEmployee } = useEmployeeStore();
```

**Funcionalidades:**
- CRUD de empleados
- Gestión de cargos
- Activación/desactivación de empleados

### 7. **agendaStore.ts** - Agenda y Citas
Maneja la agenda, citas y horarios disponibles.

```typescript
import { useAgendaStore } from '@/shared/stores';

const { appointments, createAppointment, confirmAppointment, fetchAvailableSlots } = useAgendaStore();
```

**Funcionalidades:**
- CRUD de citas
- Confirmación/cancelación de citas
- Verificación de conflictos
- Horarios disponibles

### 8. **masterDataStore.ts** - Datos Maestros
Maneja todos los datos maestros del sistema.

```typescript
import { useMasterDataStore } from '@/shared/stores';

const { 
  districts, 
  genders, 
  documentTypes, 
  paymentMethods, 
  jobTitles, 
  categories,
  fetchAllMasterData 
} = useMasterDataStore();
```

**Funcionalidades:**
- Carga de todos los datos maestros
- CRUD para cada tipo de dato maestro
- Filtros de datos activos

## Uso General

### Importación
```typescript
import { 
  useAuthStore, 
  usePatientStore, 
  useServiceStore,
  useQuotationStore,
  usePaymentStore,
  useEmployeeStore,
  useAgendaStore,
  useMasterDataStore 
} from '@/shared/stores';
```

### Patrón de Uso
```typescript
const MyComponent = () => {
  const { 
    patients, 
    isLoading, 
    error, 
    fetchPatients 
  } = usePatientStore();

  useEffect(() => {
    fetchPatients();
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {patients.map(patient => (
        <div key={patient.patient_id}>
          {patient.first_name} {patient.last_name}
        </div>
      ))}
    </div>
  );
};
```

## Características Comunes

Todas las stores comparten las siguientes características:

### Estado
- `isLoading`: Estado de carga
- `error`: Mensaje de error
- `filters`: Filtros aplicados
- `selectedItem`: Elemento seleccionado

### Acciones
- `fetchItems()`: Cargar elementos
- `createItem()`: Crear elemento
- `updateItem()`: Actualizar elemento
- `deleteItem()`: Eliminar elemento
- `setFilters()`: Aplicar filtros
- `clearError()`: Limpiar errores

### Manejo de Errores
```typescript
const { error, clearError } = usePatientStore();

useEffect(() => {
  if (error) {
    // Mostrar notificación de error
    toast.error(error);
    clearError();
  }
}, [error]);
```

### Filtros
```typescript
const { filters, setFilters } = usePatientStore();

const handleSearch = (search: string) => {
  setFilters({ search });
};
```

## Persistencia

Algunas stores como `authStore` utilizan persistencia para mantener el estado entre sesiones:

```typescript
// El token y usuario se mantienen en localStorage
const { token, user, isAuthenticated } = useAuthStore();
```

## Optimizaciones

- Las stores utilizan Zustand para un rendimiento optimizado
- Las actualizaciones son inmutables
- Se evitan re-renders innecesarios
- Las llamadas a la API están centralizadas

## API Endpoints

Las stores esperan los siguientes endpoints:

- `/api/auth/*` - Autenticación
- `/api/patients/*` - Pacientes
- `/api/services/*` - Servicios
- `/api/quotations/*` - Cotizaciones
- `/api/payments/*` - Pagos
- `/api/employees/*` - Empleados
- `/api/agenda/*` - Agenda
- `/api/master-data/*` - Datos maestros 