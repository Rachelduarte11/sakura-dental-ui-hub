export interface Service {
  serviceId: number;
  name: string;
  description: string;
  basePrice: number;
  status: boolean;
  categorieServiceId: number;
  createdAt?: string;
  [key: string]: any; // Permitir campos extra
}

export interface CategorieService {
  categorieServiceId: number;
  name: string;
  description: string;
  status: boolean;
}

export interface ServiceFilters {
  search: string;
  categorieServiceId?: number | null;
  status?: boolean | null;
  minPrice?: number;
  maxPrice?: number;
} 