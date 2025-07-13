export interface Service {
  service_id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: boolean;
  created_at: string;
  categorie_service_id: number;
}

export interface ServiceCategory {
  categorie_service_id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface ServiceFilters {
  search: string;
  categoryId: number | null;
  status: boolean | null;
  minPrice?: number;
  maxPrice?: number;
} 