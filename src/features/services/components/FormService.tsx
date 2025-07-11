import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Separator } from '@/shared/components/ui/separator';

export interface ServiceFormData {
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  activo: boolean;
}

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  title?: string;
  submitButtonText?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title = "Formulario de Servicio",
  submitButtonText = "Guardar Servicio"
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    nombre: '',
    precio: 0,
    descripcion: '',
    categoria: '',
    activo: true,
    ...(initialData && {
      ...initialData,
      precio: initialData.precio !== undefined ? Number(initialData.precio) : 0
    })
  });

  const [errors, setErrors] = useState<Record<keyof ServiceFormData, string | undefined>>({
    nombre: undefined,
    precio: undefined,
    descripcion: undefined,
    categoria: undefined,
    activo: undefined
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        precio: initialData.precio !== undefined ? Number(initialData.precio) : prev.precio
      }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<keyof ServiceFormData, string | undefined> = {
      nombre: undefined,
      precio: undefined,
      descripcion: undefined,
      categoria: undefined,
      activo: undefined
    };

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).every(key => !newErrors[key as keyof ServiceFormData]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value as any }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePrecioChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, precio: numericValue }));
    
    if (errors.precio) {
      setErrors(prev => ({ ...prev, precio: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre del Servicio */}
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
          Nombre del Servicio *
        </Label>
        <Input
          id="nombre"
          type="text"
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          placeholder="Ej: Limpieza Dental"
          className={errors.nombre ? 'border-red-500' : ''}
        />
        {errors.nombre && (
          <p className="text-sm text-red-500">{errors.nombre}</p>
        )}
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <Label htmlFor="precio" className="text-sm font-medium text-gray-700">
          Precio (S/) *
        </Label>
        <Input
          id="precio"
          type="number"
          step="0.01"
          min="0"
          value={formData.precio.toString()}
          onChange={(e) => handlePrecioChange(e.target.value)}
          placeholder="0.00"
          className={errors.precio ? 'border-red-500' : ''}
        />
        {errors.precio && (
          <p className="text-sm text-red-500">{errors.precio}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
          Descripción *
        </Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          placeholder="Describe el servicio en detalle..."
          rows={4}
          className={errors.descripcion ? 'border-red-500' : ''}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-500">{errors.descripcion}</p>
        )}
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <Label htmlFor="categoria" className="text-sm font-medium text-gray-700">
          Categoría *
        </Label>
        <select
          id="categoria"
          value={formData.categoria}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
          className={`w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus:border-sakura-red focus:ring-sakura-red/20 ${errors.categoria ? 'border-red-500' : ''}`}
        >
          <option value="">Seleccionar categoría</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Estético">Estético</option>
          <option value="Endodoncia">Endodoncia</option>
          <option value="Prótesis">Prótesis</option>
          <option value="Ortodoncia">Ortodoncia</option>
          <option value="Cirugía">Cirugía</option>
          <option value="Periodoncia">Periodoncia</option>
          <option value="Odontopediatría">Odontopediatría</option>
          <option value="Otros">Otros</option>
        </select>
        {errors.categoria && (
          <p className="text-sm text-red-500">{errors.categoria}</p>
        )}
      </div>

      <Separator />

      {/* Estado Activo */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="activo" className="text-sm font-medium text-gray-700">
            Servicio Activo
          </Label>
          <p className="text-xs text-gray-500">
            Los servicios inactivos no aparecerán en las opciones de citas
          </p>
        </div>
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) => handleInputChange('activo', checked)}
        />
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-sakura-red hover:bg-sakura-red/90 text-white"
        >
          {isLoading ? 'Guardando...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm; 