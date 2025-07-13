import React from 'react';
import { Button } from './ui/button';
import { Plus, FileText, Users, Calendar, DollarSign, Package, Settings, Stethoscope } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  variant = 'default'
}) => {
  const defaultIcon = (
    <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
      <FileText className="w-8 h-8 text-sakura-red" />
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {icon || defaultIcon}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 max-w-sm">{description}</p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="mt-4 bg-sakura-red hover:bg-sakura-red-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {icon || defaultIcon}
      <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 bg-sakura-red hover:bg-sakura-red-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// Componentes específicos para diferentes secciones
export const EmptyQuotes: React.FC<{ onCreateQuote?: () => void }> = ({ onCreateQuote }) => (
  <EmptyState
    title="No hay cotizaciones"
    description="Aún no se han creado cotizaciones. Comienza creando la primera cotización para un paciente."
    icon={
      <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
        <FileText className="w-8 h-8 text-sakura-red" />
      </div>
    }
    actionLabel="Crear cotización"
    onAction={onCreateQuote}
  />
);

export const EmptyPatients: React.FC<{ onAddPatient?: () => void }> = ({ onAddPatient }) => (
  <EmptyState
    title="No hay pacientes registrados"
    description="Comienza agregando el primer paciente a tu base de datos."
    icon={
      <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
        <Users className="w-8 h-8 text-sakura-red" />
      </div>
    }
    actionLabel="Agregar paciente"
    onAction={onAddPatient}
  />
);

export const EmptySales: React.FC<{ onNewSale?: () => void }> = ({ onNewSale }) => (
  <EmptyState
    title="No hay ventas registradas"
    description="Aún no se han procesado ventas. Comienza con la primera transacción."
    icon={
      <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
        <DollarSign className="w-8 h-8 text-sakura-red" />
      </div>
    }
    actionLabel="Nueva venta"
    onAction={onNewSale}
  />
);

export const EmptyInventory: React.FC<{ onAddItem?: () => void }> = ({ onAddItem }) => (
  <EmptyState
    title="Inventario vacío"
    description="No hay productos en el inventario. Comienza agregando los primeros productos."
    icon={
      <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
        <Package className="w-8 h-8 text-sakura-red" />
      </div>
    }
    actionLabel="Agregar producto"
    onAction={onAddItem}
  />
);

export const EmptyDoctors: React.FC<{ onAddDoctor?: () => void }> = ({ onAddDoctor }) => (
  <EmptyState
    title="No hay doctores registrados"
    description="Comienza agregando el primer doctor a tu equipo."
    icon={
      <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
        <Stethoscope className="w-8 h-8 text-sakura-red" />
      </div>
    }
    actionLabel="Agregar doctor"
    onAction={onAddDoctor}
  />
);

export const EmptyAgenda: React.FC<{ onNewAppointment?: () => void }> = ({ onNewAppointment }) => (
  <EmptyState
    title="Agenda vacía"
    description="No hay citas programadas. Comienza programando la primera cita."
    icon={
      <div className="w-16 h-16 bg-sakura-red/10 rounded-full flex items-center justify-center">
        <Calendar className="w-8 h-8 text-sakura-red" />
      </div>
    }
    actionLabel="Nueva cita"
    onAction={onNewAppointment}
  />
);

export default EmptyState; 