// API
export { inventoryApi } from './api/inventoryApi';
export type {
  Product,
  ProductWithDetails,
  ProductCategory,
  InventoryMovement,
  InventoryFilters,
  CreateProductRequest,
  UpdateProductRequest,
  CreateMovementRequest,
  InventorySummary,
} from './api/types';

// Store
export { useInventoryStore } from './store/inventoryStore';

// Hooks
export { useInventory } from './hooks/useInventory';

// Components
export { InventoryList } from './components/InventoryList'; 