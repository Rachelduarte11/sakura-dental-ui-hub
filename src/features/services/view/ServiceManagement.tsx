import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useServiceActions } from '../hooks/useServiceActions';
import { ServiceSearchBar } from '../components/ServiceSearchBar';
import { ServiceList } from '../components/ServiceList';
import { ServiceDialog } from '../components/ServiceDialog';
import { useCategorieServiceStore } from '../store/categorieServiceStore';
import { Button } from '@/shared/components/ui/button';

const ServiceManagement = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const {
    services,
    isLoading,
    error,
    fetchServices,
    setFilters,
    clearError,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useServiceActions();

  const { categories, fetchCategories } = useCategorieServiceStore();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices, fetchCategories]);

  useEffect(() => {
    setFilters({ search: searchQuery });
  }, [searchQuery, setFilters]);

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(categories.map(c => c.name)));
    return ['Todas', ...unique];
  }, [categories]);

  const filteredServices = services.filter(service =>
    (service.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'Todas' ||
      categories.find(c => c.categorieServiceId === service.categorieServiceId)?.name === selectedCategory)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando servicios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior: buscador, filtro y botón */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 p-4">
        <div className="flex-1">
          <ServiceSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoryOptions={categoryOptions}
          />
        </div>
        <Button
          className="bg-sakura-red hover:bg-sakura-red-dark text-white whitespace-nowrap"
          onClick={() => {
            setEditingService(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Diálogo para crear/editar */}
      <ServiceDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingService={editingService}
        onSubmit={async (data) => {
          if (editingService) {
            await handleUpdate(editingService.serviceId, data);
          } else {
            await handleCreate(data);
          }
          setIsDialogOpen(false);
          setEditingService(null);
        }}
        onCancel={() => {
          setIsDialogOpen(false);
          setEditingService(null);
        }}
      />

      {/* Lista de servicios */}
      <ServiceList
        services={filteredServices}
        onEdit={setEditingService}
        onDelete={handleDelete}
        onToggleStatus={async (id) => {
          const service = services.find(s => s.serviceId === id);
          if (service) {
            await handleUpdate(id, { status: !service.status });
          }
        }}
      />
    </div>
  );
};

export default ServiceManagement;
