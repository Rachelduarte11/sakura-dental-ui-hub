# Sakura Dental - Features-based Architecture

This project follows a features-based folder structure with Next.js App Router for better organization and scalability.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (routes)
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (redirects to /welcome)
│   ├── welcome/            # Authentication flow
│   ├── login/
│   ├── register/
│   ├── home/               # Main dashboard
│   ├── patients/           # Patient management
│   ├── doctors/            # Doctor management
│   ├── services/           # Service management
│   ├── quotes/             # Quote management
│   ├── sales/              # Sales module
│   ├── inventory/          # Inventory management
│   ├── finances/           # Finance management
│   ├── payments/           # Payment management
│   ├── patient-account/    # Patient account
│   └── not-found.tsx       # 404 page
│
├── features/               # Domain-specific modules
│   ├── auth/               # Authentication (welcome, login, register)
│   │   ├── components/     # Auth-specific components
│   │   └── index.ts        # Export barrel
│   ├── patients/           # Patient management
│   │   ├── components/     # Patient-specific components
│   │   └── index.ts
│   ├── doctors/            # Doctor management
│   ├── services/           # Service management
│   ├── quotes/             # Quote management
│   ├── sales/              # Sales module
│   ├── inventory/          # Inventory management
│   ├── finances/           # Finance management
│   └── payments/           # Payment management
│
├── shared/                 # Reusable code across features
│   ├── components/         # Shared UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AppLayout.tsx   # Main layout component
│   │   ├── HomeScreen.tsx  # Dashboard component
│   │   ├── SakuraIcon.tsx  # Brand icon
│   │   └── index.ts        # Export barrel
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Global state management (future Zustand stores)
│   ├── types/             # Shared TypeScript interfaces
│   │   └── index.ts       # Common types (User, Navigation, etc.)
│   └── utils/             # Utility functions
│       └── lib/           # External integrations
│
├── constants/             # Application constants
│   └── routes.ts          # Route definitions
│
└── styles/               # Global styles
    └── globals.css       # Global CSS with Tailwind imports
```

## 🎯 Key Benefits

1. **Feature-based Organization**: Each domain (patients, doctors, etc.) has its own dedicated folder
2. **Clear Separation**: Shared components are separated from feature-specific ones
3. **Better Scalability**: Easy to add new features without cluttering existing code
4. **Improved Developer Experience**: Cleaner imports with TypeScript path mapping (`@/*`)
5. **Next.js App Router**: Modern routing with file-based system

## 🚀 Usage

### Adding a New Feature
1. Create a new folder in `src/features/`
2. Add `components/`, `hooks/`, `store.ts`, `types.ts`, `utils.ts` as needed
3. Create an `index.ts` file for exports
4. Add corresponding route in `src/app/`

### Import Examples
```typescript
// Feature components
import { WelcomeScreen } from '@/features/auth';
import { PatientManagement } from '@/features/patients';

// Shared components
import { AppLayout, SakuraIcon } from '@/shared/components';

// Constants
import { ROUTES } from '@/constants/routes';

// Types
import { User, NavigationProps } from '@/shared/types';
```

## 🔧 Path Mapping

The project uses TypeScript path mapping for cleaner imports:
- `@/*` maps to `./src/*`

This allows importing with `@/features/auth` instead of `../../../features/auth`. 