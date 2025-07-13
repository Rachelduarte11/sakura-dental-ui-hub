import React, { useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useCategorieServiceStore } from '../store/categorieServiceStore';

export interface ServiceFormData {
  name: string;
  description: string;
  basePrice: number;
  categorieServiceId: number;
  serviceId?: number;
}

interface Props {
  initialData: ServiceFormData;
  onSubmit: (data: { name: string; description: string; basePrice: number; categoryId: number; categoryName: string; status: boolean }) => void;
  onCancel: () => void;
  submitButtonText?: string;
}

const FormService: React.FC<Props> = ({ initialData, onSubmit, onCancel, submitButtonText }) => {
  const [formData, setFormData] = React.useState<ServiceFormData>(initialData);
  const { categories, fetchCategories, isLoading } = useCategorieServiceStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSelectCategory = (value: string) => {
    setFormData((prev) => ({ ...prev, categorieServiceId: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(c => c.categorieServiceId === formData.categorieServiceId);
    onSubmit({
      name: formData.name,
      description: formData.description,
      basePrice: formData.basePrice,
      categoryId: formData.categorieServiceId,
      categoryName: selectedCategory ? selectedCategory.name : '',
      status: true
    });
  };

  // Título dinámico
  const isEdit = Boolean(formData.serviceId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Servicio</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="basePrice">Precio Base</Label>
        <Input
          id="basePrice"
          name="basePrice"
          type="number"
          value={formData.basePrice}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="categorieServiceId">Categoría</Label>
        <Select
          value={formData.categorieServiceId ? formData.categorieServiceId.toString() : ''}
          onValueChange={handleSelectCategory}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? 'Cargando...' : 'Seleccionar categoría'} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.categorieServiceId} value={cat.categorieServiceId.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {submitButtonText || 'Guardar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default FormService; 