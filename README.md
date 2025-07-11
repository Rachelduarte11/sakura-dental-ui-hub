<div align="center">
  <img src="public/logo.png" alt="Sakura Dental Logo" width="300" />
  
  # Sakura Dental - Sistema de Gestión Dental
  
  Un sistema completo de gestión para clínicas dentales desarrollado con Next.js, TypeScript y Tailwind CSS.
  
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
</div>

## 🏥 Descripción del Proyecto

Sakura Dental es un sistema integral de gestión para clínicas dentales que permite administrar de manera eficiente todos los aspectos de una práctica dental moderna. El sistema incluye gestión de pacientes, doctores, citas, servicios, inventario, finanzas y más.

### ✨ Características Principales

- **👥 Gestión de Pacientes**: Registro completo de pacientes con historial médico
- **👨‍⚕️ Gestión de Doctores**: Administración de personal médico y especialidades
- **📅 Agenda Inteligente**: Sistema de citas con calendario visual y colores por doctor
- **🛍️ Punto de Venta (POS)**: Sistema de facturación y cobros
- **💰 Gestión Financiera**: Control de ingresos, gastos y reportes
- **📋 Servicios Dentales**: Catálogo de tratamientos y procedimientos
- **📦 Inventario**: Control de stock y materiales
- **💳 Gestión de Pagos**: Seguimiento de pagos y cuentas por cobrar
- **📊 Dashboard**: Métricas y estadísticas en tiempo real

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm, yarn o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sakura-dental-ui-hub.git

# Navegar al directorio
cd sakura-dental-ui-hub

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en modo producción
npm run lint         # Ejecutar linter
```

## 🏗️ Arquitectura del Proyecto

Este proyecto utiliza el patrón **Feature-Based Folders** para organizar el código de manera escalable y mantenible.

### 📁 Estructura de Carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── agenda/                   # Página de agenda
│   ├── patients/                 # Página de pacientes
│   ├── doctors/                  # Página de doctores
│   ├── services/                 # Página de servicios
│   ├── sales/                    # Página de POS
│   ├── inventory/                # Página de inventario
│   ├── finances/                 # Página de finanzas
│   ├── payments/                 # Página de pagos
│   ├── quotes/                   # Página de cotizaciones

│   ├── home/                     # Página principal
│   ├── login/                    # Página de login
│   ├── register/                 # Página de registro
│   ├── welcome/                  # Página de bienvenida
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página raíz
├── features/                     # Módulos de funcionalidad
│   ├── auth/                     # Autenticación
│   │   ├── components/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   └── index.ts
│   ├── agenda/                   # Sistema de citas
│   │   ├── components/
│   │   │   ├── AgendaManagement.tsx
│   │   │   ├── AppointmentForm.tsx
│   │   │   └── AppointmentModal.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── patients/                 # Gestión de pacientes
│   ├── doctors/                  # Gestión de doctores
│   ├── services/                 # Gestión de servicios
│   ├── sales/                    # Punto de venta
│   ├── inventory/                # Gestión de inventario
│   ├── finances/                 # Gestión financiera
│   ├── payments/                 # Gestión de pagos
│   └── quotes/                   # Gestión de cotizaciones
├── shared/                       # Componentes y utilidades compartidas
│   ├── components/
│   │   ├── ui/                   # Componentes de UI base
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── AppLayout.tsx         # Layout de aplicación
│   │   ├── Sidebar.tsx           # Barra lateral
│   │   └── HomeScreen.tsx        # Pantalla principal
│   ├── hooks/                    # Hooks personalizados
│   ├── stores/                   # Estado global
│   ├── types/                    # Tipos TypeScript compartidos
│   └── utils/                    # Utilidades
├── constants/                    # Constantes de la aplicación
│   └── routes.ts
└── styles/                       # Estilos globales
    └── globals.css
```

## 🎨 Patrón Feature-Based Folders

### ¿Qué es Feature-Based Folders?

Es un patrón de organización que agrupa el código por **funcionalidad** en lugar de por **tipo de archivo**. Cada feature contiene todos los archivos relacionados con esa funcionalidad específica.

### Ventajas del Patrón

✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar otras  
✅ **Mantenibilidad**: Código relacionado está junto, facilitando el mantenimiento  
✅ **Reutilización**: Componentes compartidos en la carpeta `shared/`  
✅ **Claridad**: Estructura intuitiva que refleja las funcionalidades del negocio  
✅ **Colaboración**: Equipos pueden trabajar en features independientes  

### Estructura de una Feature

```
features/[feature-name]/
├── components/           # Componentes específicos de la feature
│   ├── FeatureMain.tsx
│   ├── FeatureForm.tsx
│   └── FeatureModal.tsx
├── hooks/               # Hooks específicos de la feature
│   └── useFeature.ts
├── types/               # Tipos TypeScript de la feature
│   └── index.ts
├── utils/               # Utilidades específicas de la feature
│   └── helpers.ts
├── constants/           # Constantes de la feature
│   └── index.ts
└── index.ts            # Exportaciones principales
```

### Reglas de Organización

1. **Específico de Feature**: Solo código relacionado con esa funcionalidad
2. **Componentes Compartidos**: Van en `shared/components/`
3. **Tipos Compartidos**: Van en `shared/types/`
4. **Utilidades Compartidas**: Van en `shared/utils/`
5. **Exportaciones Limpias**: Cada feature exporta desde `index.ts`

## 🎨 Sistema de Diseño

### Colores Principales

```css
/* Colores de la marca */
--sakura-red: #FF6E63;           /* Color principal */
--sakura-red-dark: #E55A4F;     /* Hover states */
--sakura-coral: #FFB5B0;        /* Acentos */
--sakura-gray: #6B7280;         /* Texto secundario */
--sakura-gray-light: #F9FAFB;   /* Fondos */
--sakura-gray-medium: #D1D5DB;  /* Bordes */
```

### Sombras Personalizadas

```css
.shadow-simple-shadow {
  box-shadow: 0 2px 24.7px 0 rgba(148, 148, 148, 0.25);
}
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **shadcn/ui**: Componentes de UI
- **Lucide React**: Iconos

### Herramientas de Desarrollo
- **ESLint**: Linting de código
- **PostCSS**: Procesamiento de CSS

## 📱 Funcionalidades por Módulo

### 🏠 Dashboard (Home)
- Métricas del día
- Resumen de pagos y cotizaciones
- Acceso rápido a funcionalidades

### 📅 Agenda
- Calendario mensual interactivo
- Colores por doctor
- Formulario de agendamiento
- Gestión de citas

### 👥 Gestión de Pacientes
- Registro de pacientes
- Historial médico
- Información de contacto

### 👨‍⚕️ Gestión de Doctores
- Registro de personal médico
- Especialidades
- Horarios de trabajo

### 🛍️ Punto de Venta (POS)
- Facturación
- Cobros
- Historial de ventas

### 💰 Gestión Financiera
- Reportes de ingresos
- Control de gastos
- Análisis financiero

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deployar
vercel
```

### Build Manual
```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

Para soporte o consultas sobre el proyecto:

- **Email**: soporte@sakuradental.com
- **Website**: https://sakuradental.com

---

<div align="center">
  Desarrollado con ❤️ por el equipo de Sakura Dental
</div> 