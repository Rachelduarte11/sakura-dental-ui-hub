import { create } from 'zustand';

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  status: boolean;
  hired_at: string;
  district_id: number;
  gender_id: number;
  job_title_id: number;
  document_type_id: number;
  district?: {
    name: string;
  };
  gender?: {
    name: string;
  };
  job_title?: {
    name: string;
    description?: string;
  };
  document_type?: {
    name: string;
    code: string;
  };
}

export interface JobTitle {
  job_title_id: number;
  name: string;
  description?: string;
  status: boolean;
}

interface EmployeeState {
  employees: Employee[];
  jobTitles: JobTitle[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: boolean | null;
    jobTitleId: number | null;
    specialty: string | null;
  };
}

interface EmployeeActions {
  // Fetch actions
  fetchEmployees: () => Promise<void>;
  fetchJobTitles: () => Promise<void>;
  fetchEmployeeById: (id: number) => Promise<void>;
  
  // CRUD actions for employees
  createEmployee: (employee: Omit<Employee, 'employee_id'>) => Promise<void>;
  updateEmployee: (id: number, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  
  // CRUD actions for job titles
  createJobTitle: (jobTitle: Omit<JobTitle, 'job_title_id'>) => Promise<void>;
  updateJobTitle: (id: number, jobTitle: Partial<JobTitle>) => Promise<void>;
  deleteJobTitle: (id: number) => Promise<void>;
  
  // Business logic actions
  activateEmployee: (id: number) => Promise<void>;
  deactivateEmployee: (id: number) => Promise<void>;
  
  // State management
  setSelectedEmployee: (employee: Employee | null) => void;
  setFilters: (filters: Partial<EmployeeState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useEmployeeStore = create<EmployeeState & EmployeeActions>((set, get) => ({
  // State
  employees: [],
  jobTitles: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    jobTitleId: null,
    specialty: null,
  },

  // Actions
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== null) params.append('status', filters.status.toString());
      if (filters.jobTitleId) params.append('jobTitleId', filters.jobTitleId.toString());
      if (filters.specialty) params.append('specialty', filters.specialty);

      const response = await fetch(`/api/employees?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar empleados');
      }
      const data = await response.json();
      set({ employees: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchJobTitles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/employees/job-titles');
      if (!response.ok) {
        throw new Error('Error al cargar cargos');
      }
      const data = await response.json();
      set({ jobTitles: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchEmployeeById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar empleado');
      }
      const data = await response.json();
      set({ selectedEmployee: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createEmployee: async (employee) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error('Error al crear empleado');
      }

      const newEmployee = await response.json();
      set((state) => ({
        employees: [...state.employees, newEmployee],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateEmployee: async (id: number, employee) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar empleado');
      }

      const updatedEmployee = await response.json();
      set((state) => ({
        employees: state.employees.map((e) =>
          e.employee_id === id ? updatedEmployee : e
        ),
        selectedEmployee: state.selectedEmployee?.employee_id === id ? updatedEmployee : state.selectedEmployee,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteEmployee: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar empleado');
      }

      set((state) => ({
        employees: state.employees.filter((e) => e.employee_id !== id),
        selectedEmployee: state.selectedEmployee?.employee_id === id ? null : state.selectedEmployee,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createJobTitle: async (jobTitle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/employees/job-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobTitle),
      });

      if (!response.ok) {
        throw new Error('Error al crear cargo');
      }

      const newJobTitle = await response.json();
      set((state) => ({
        jobTitles: [...state.jobTitles, newJobTitle],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateJobTitle: async (id: number, jobTitle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/job-titles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobTitle),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cargo');
      }

      const updatedJobTitle = await response.json();
      set((state) => ({
        jobTitles: state.jobTitles.map((j) =>
          j.job_title_id === id ? updatedJobTitle : j
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteJobTitle: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/job-titles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar cargo');
      }

      set((state) => ({
        jobTitles: state.jobTitles.filter((j) => j.job_title_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  activateEmployee: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/${id}/activate`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al activar empleado');
      }

      const updatedEmployee = await response.json();
      set((state) => ({
        employees: state.employees.map((e) =>
          e.employee_id === id ? updatedEmployee : e
        ),
        selectedEmployee: state.selectedEmployee?.employee_id === id ? updatedEmployee : state.selectedEmployee,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deactivateEmployee: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/employees/${id}/deactivate`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al desactivar empleado');
      }

      const updatedEmployee = await response.json();
      set((state) => ({
        employees: state.employees.map((e) =>
          e.employee_id === id ? updatedEmployee : e
        ),
        selectedEmployee: state.selectedEmployee?.employee_id === id ? updatedEmployee : state.selectedEmployee,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedEmployee: (employee) => {
    set({ selectedEmployee: employee });
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 