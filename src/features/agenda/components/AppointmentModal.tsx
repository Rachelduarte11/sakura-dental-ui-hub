import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { X, Calendar, Clock, User, Stethoscope, Briefcase, Phone, Edit, Trash2 } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  onClose,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'no-show': return 'No asistió';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      onDelete(appointment.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg shadow-simple-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">
              Detalles de la Cita
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estado</span>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </div>

          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-sakura-red" />
              <div>
                <div className="font-medium text-gray-800">
                  {formatDate(appointment.date)}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {formatDate(appointment.date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-sakura-red" />
              <div>
                <div className="font-medium text-gray-800">
                  {appointment.startTime} - {appointment.endTime}
                </div>
                <div className="text-sm text-gray-600">
                  Duración: {appointment.service?.duration || 0} minutos
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-sakura-red" />
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {appointment.patient?.name}
                </div>
                {appointment.patient?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {appointment.patient.phone}
                  </div>
                )}
                {appointment.patient?.dni && (
                  <div className="text-sm text-gray-600">
                    DNI: {appointment.patient.dni}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-sakura-red" />
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: appointment.doctor?.color }}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    {appointment.doctor?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.doctor?.specialty}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-sakura-red" />
              <div>
                <div className="font-medium text-gray-800">
                  {appointment.service?.name}
                </div>
                <div className="text-sm text-gray-600">
                  S/ {appointment.service?.price} • {appointment.service?.duration} min
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Notas</div>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                {appointment.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onEdit(appointment)}
              className="flex-1 h-12 rounded-xl hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="flex-1 h-12 rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentModal; 