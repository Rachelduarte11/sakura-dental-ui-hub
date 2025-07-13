# Integración del Backend con Sakura Dental UI Hub

## Resumen

Este documento describe las diferentes formas de integrar un backend con el frontend Next.js de Sakura Dental, que ya cuenta con stores Zustand preparadas para la integración.

## Opciones de Integración

### 1. **API Routes de Next.js (Desarrollo/Prototipado)**

**Ventajas:**
- Rápido de implementar
- No requiere servidor separado
- Ideal para prototipos y desarrollo

**Implementación:**
```typescript
// src/app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Lógica para obtener pacientes
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  const patient = await request.json();
  // Lógica para crear paciente
  return NextResponse.json(newPatient);
}
```

### 2. **Backend Separado (Producción)**

**Ventajas:**
- Separación de responsabilidades
- Escalabilidad independiente
- Tecnologías específicas para backend

**Configuración:**
```bash
# Variables de entorno
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Estructura de Integración

### Cliente API Centralizado

El proyecto incluye un cliente API centralizado en `src/shared/utils/api-client.ts` que maneja:

- **Autenticación automática**: Incluye tokens en headers
- **Manejo de errores**: Intercepta errores 401 y redirige al login
- **Configuración centralizada**: URL base configurable
- **Tipado TypeScript**: Respuestas tipadas

### Stores Actualizadas

Las stores ya están preparadas para usar el cliente API:

```typescript
// Ejemplo de uso en una store
import { patientsApi } from '../utils/api-client';

export const usePatientStore = create<PatientState & PatientActions>((set, get) => ({
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await patientsApi.getAll();
      set({ patients: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },
}));
```

### Hooks Personalizados

Hooks para simplificar el uso de APIs:

```typescript
// Uso del hook CRUD
const {
  items: patients,
  loading,
  error,
  fetchAll,
  create,
  update,
  remove
} = useCrudApi(patientsApi);

// Cargar pacientes
useEffect(() => {
  fetchAll();
}, [fetchAll]);
```

## Endpoints Esperados

El frontend espera los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token

### Pacientes
- `GET /api/patients` - Listar pacientes
- `GET /api/patients/:id` - Obtener paciente
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Servicios
- `GET /api/services` - Listar servicios
- `GET /api/services/:id` - Obtener servicio
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio
- `GET /api/services/categories` - Categorías de servicios

### Cotizaciones
- `GET /api/quotations` - Listar cotizaciones
- `GET /api/quotations/:id` - Obtener cotización
- `POST /api/quotations` - Crear cotización
- `PUT /api/quotations/:id` - Actualizar cotización
- `DELETE /api/quotations/:id` - Eliminar cotización

### Pagos
- `GET /api/payments` - Listar pagos
- `GET /api/payments/:id` - Obtener pago
- `POST /api/payments` - Crear pago
- `POST /api/payments/process` - Procesar pago
- `GET /api/payments/methods` - Métodos de pago

### Datos Maestros
- `GET /api/master-data/districts` - Distritos
- `GET /api/master-data/genders` - Géneros
- `GET /api/master-data/document-types` - Tipos de documento
- `GET /api/master-data/payment-methods` - Métodos de pago
- `GET /api/master-data/job-titles` - Cargos
- `GET /api/master-data/categories` - Categorías

### Agenda
- `GET /api/agenda/appointments` - Listar citas
- `GET /api/agenda/appointments/:id` - Obtener cita
- `POST /api/agenda/appointments` - Crear cita
- `PUT /api/agenda/appointments/:id` - Actualizar cita
- `DELETE /api/agenda/appointments/:id` - Eliminar cita
- `GET /api/agenda/slots` - Horarios disponibles

### Inventario
- `GET /api/inventory` - Listar items
- `GET /api/inventory/:id` - Obtener item
- `POST /api/inventory` - Crear item
- `PUT /api/inventory/:id` - Actualizar item
- `DELETE /api/inventory/:id` - Eliminar item
- `GET /api/inventory/categories` - Categorías

## Configuración de Desarrollo

### 1. Variables de Entorno

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Proxy de Desarrollo

El `next.config.js` incluye configuración de proxy:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
        : '/api/:path*',
    },
  ];
}
```

### 3. Middleware de Autenticación

El middleware en `src/middleware.ts` protege las rutas:
- Redirige a `/login` si no está autenticado
- Redirige a `/home` si está autenticado en rutas públicas

## Pasos para Integrar Backend

### Opción A: Backend Separado

1. **Configurar URL del backend:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

2. **Implementar endpoints en el backend** según la estructura esperada

3. **Verificar autenticación:**
   - El backend debe devolver tokens JWT
   - Manejar refresh tokens
   - Validar tokens en endpoints protegidos

### Opción B: API Routes de Next.js

1. **Crear API routes** en `src/app/api/`
2. **Conectar con base de datos** (Prisma, TypeORM, etc.)
3. **Implementar autenticación** con JWT o sesiones

### Opción C: Backend Híbrido

1. **Usar API Routes para desarrollo**
2. **Migrar a backend separado para producción**
3. **Mantener compatibilidad de endpoints**

## Manejo de Errores

El cliente API maneja automáticamente:
- **Errores 401**: Logout automático y redirección
- **Errores de red**: Mensajes de error descriptivos
- **Timeouts**: Configuración de timeouts
- **Retry logic**: Reintentos automáticos

## Optimizaciones

### Caché y Estado
- Las stores mantienen estado local
- React Query para caché de servidor
- Optimistic updates para mejor UX

### Performance
- Lazy loading de datos
- Paginación en listas grandes
- Debounce en búsquedas

## Testing

### API Testing
```typescript
// Ejemplo de test para API
describe('Patients API', () => {
  it('should fetch patients', async () => {
    const response = await patientsApi.getAll();
    expect(response.data).toBeDefined();
  });
});
```

### Store Testing
```typescript
// Ejemplo de test para store
describe('Patient Store', () => {
  it('should update patients on fetch', async () => {
    const store = usePatientStore.getState();
    await store.fetchPatients();
    expect(store.patients).toHaveLength(5);
  });
});
```

## Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Variables de Producción
```env
NEXT_PUBLIC_API_URL=https://api.sakura-dental.com/api
```

## Conclusión

El frontend está completamente preparado para integrarse con cualquier backend que implemente los endpoints esperados. La arquitectura modular y el cliente API centralizado facilitan la integración y mantenimiento del código. 

## Resumen

Este documento describe las diferentes formas de integrar un backend con el frontend Next.js de Sakura Dental, que ya cuenta con stores Zustand preparadas para la integración.

## Opciones de Integración

### 1. **API Routes de Next.js (Desarrollo/Prototipado)**

**Ventajas:**
- Rápido de implementar
- No requiere servidor separado
- Ideal para prototipos y desarrollo

**Implementación:**
```typescript
// src/app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Lógica para obtener pacientes
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  const patient = await request.json();
  // Lógica para crear paciente
  return NextResponse.json(newPatient);
}
```

### 2. **Backend Separado (Producción)**

**Ventajas:**
- Separación de responsabilidades
- Escalabilidad independiente
- Tecnologías específicas para backend

**Configuración:**
```bash
# Variables de entorno
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Estructura de Integración

### Cliente API Centralizado

El proyecto incluye un cliente API centralizado en `src/shared/utils/api-client.ts` que maneja:

- **Autenticación automática**: Incluye tokens en headers
- **Manejo de errores**: Intercepta errores 401 y redirige al login
- **Configuración centralizada**: URL base configurable
- **Tipado TypeScript**: Respuestas tipadas

### Stores Actualizadas

Las stores ya están preparadas para usar el cliente API:

```typescript
// Ejemplo de uso en una store
import { patientsApi } from '../utils/api-client';

export const usePatientStore = create<PatientState & PatientActions>((set, get) => ({
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await patientsApi.getAll();
      set({ patients: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },
}));
```

### Hooks Personalizados

Hooks para simplificar el uso de APIs:

```typescript
// Uso del hook CRUD
const {
  items: patients,
  loading,
  error,
  fetchAll,
  create,
  update,
  remove
} = useCrudApi(patientsApi);

// Cargar pacientes
useEffect(() => {
  fetchAll();
}, [fetchAll]);
```

## Endpoints Esperados

El frontend espera los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token

### Pacientes
- `GET /api/patients` - Listar pacientes
- `GET /api/patients/:id` - Obtener paciente
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Servicios
- `GET /api/services` - Listar servicios
- `GET /api/services/:id` - Obtener servicio
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio
- `GET /api/services/categories` - Categorías de servicios

### Cotizaciones
- `GET /api/quotations` - Listar cotizaciones
- `GET /api/quotations/:id` - Obtener cotización
- `POST /api/quotations` - Crear cotización
- `PUT /api/quotations/:id` - Actualizar cotización
- `DELETE /api/quotations/:id` - Eliminar cotización

### Pagos
- `GET /api/payments` - Listar pagos
- `GET /api/payments/:id` - Obtener pago
- `POST /api/payments` - Crear pago
- `POST /api/payments/process` - Procesar pago
- `GET /api/payments/methods` - Métodos de pago

### Datos Maestros
- `GET /api/master-data/districts` - Distritos
- `GET /api/master-data/genders` - Géneros
- `GET /api/master-data/document-types` - Tipos de documento
- `GET /api/master-data/payment-methods` - Métodos de pago
- `GET /api/master-data/job-titles` - Cargos
- `GET /api/master-data/categories` - Categorías

### Agenda
- `GET /api/agenda/appointments` - Listar citas
- `GET /api/agenda/appointments/:id` - Obtener cita
- `POST /api/agenda/appointments` - Crear cita
- `PUT /api/agenda/appointments/:id` - Actualizar cita
- `DELETE /api/agenda/appointments/:id` - Eliminar cita
- `GET /api/agenda/slots` - Horarios disponibles

### Inventario
- `GET /api/inventory` - Listar items
- `GET /api/inventory/:id` - Obtener item
- `POST /api/inventory` - Crear item
- `PUT /api/inventory/:id` - Actualizar item
- `DELETE /api/inventory/:id` - Eliminar item
- `GET /api/inventory/categories` - Categorías

## Configuración de Desarrollo

### 1. Variables de Entorno

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Proxy de Desarrollo

El `next.config.js` incluye configuración de proxy:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
        : '/api/:path*',
    },
  ];
}
```

### 3. Middleware de Autenticación

El middleware en `src/middleware.ts` protege las rutas:
- Redirige a `/login` si no está autenticado
- Redirige a `/home` si está autenticado en rutas públicas

## Pasos para Integrar Backend

### Opción A: Backend Separado

1. **Configurar URL del backend:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

2. **Implementar endpoints en el backend** según la estructura esperada

3. **Verificar autenticación:**
   - El backend debe devolver tokens JWT
   - Manejar refresh tokens
   - Validar tokens en endpoints protegidos

### Opción B: API Routes de Next.js

1. **Crear API routes** en `src/app/api/`
2. **Conectar con base de datos** (Prisma, TypeORM, etc.)
3. **Implementar autenticación** con JWT o sesiones

### Opción C: Backend Híbrido

1. **Usar API Routes para desarrollo**
2. **Migrar a backend separado para producción**
3. **Mantener compatibilidad de endpoints**

## Manejo de Errores

El cliente API maneja automáticamente:
- **Errores 401**: Logout automático y redirección
- **Errores de red**: Mensajes de error descriptivos
- **Timeouts**: Configuración de timeouts
- **Retry logic**: Reintentos automáticos

## Optimizaciones

### Caché y Estado
- Las stores mantienen estado local
- React Query para caché de servidor
- Optimistic updates para mejor UX

### Performance
- Lazy loading de datos
- Paginación en listas grandes
- Debounce en búsquedas

## Testing

### API Testing
```typescript
// Ejemplo de test para API
describe('Patients API', () => {
  it('should fetch patients', async () => {
    const response = await patientsApi.getAll();
    expect(response.data).toBeDefined();
  });
});
```

### Store Testing
```typescript
// Ejemplo de test para store
describe('Patient Store', () => {
  it('should update patients on fetch', async () => {
    const store = usePatientStore.getState();
    await store.fetchPatients();
    expect(store.patients).toHaveLength(5);
  });
});
```

## Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Variables de Producción
```env
NEXT_PUBLIC_API_URL=https://api.sakura-dental.com/api
```

## Conclusión

El frontend está completamente preparado para integrarse con cualquier backend que implemente los endpoints esperados. La arquitectura modular y el cliente API centralizado facilitan la integración y mantenimiento del código. 