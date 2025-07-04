import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { X, Calendar, Clock, User, Stethoscope, Briefcase } from 'lucide-react';
import { Doctor, Patient, Service, AppointmentFormData } from '../types';

interface AppointmentFormProps {
  selectedDate?: Date | null;
  doctors: Doctor[];
  patients: Patient[];
  services: Service[];
  onSubmit: (data: AppointmentFormData) => void;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedDate,
  doctors,
  patients,
  services,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    doctorId: '',
    serviceId: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    startTime: '',
    notes: ''
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedDate]);

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'doctorId') {
      const doctor = doctors.find(d => d.id === value);
      setSelectedDoctor(doctor || null);
    }
    
    if (field === 'serviceId') {
      const service = services.find(s => s.id === value);
      setSelectedService(service || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.serviceId || !formData.date || !formData.startTime) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    onSubmit(formData);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-simple-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">
              Nueva Cita
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Hora de Inicio *
                </Label>
                <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                  <SelectTrigger className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl">
                    <SelectValue placeholder="Selecciona una hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeSlots().map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Paciente *
              </Label>
              <Select value={formData.patientId} onValueChange={(value) => handleInputChange('patientId', value)}>
                <SelectTrigger className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl">
                  <SelectValue placeholder="Selecciona un paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{patient.name}</span>
                        {patient.phone && (
                          <span className="text-sm text-gray-500">{patient.phone}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctorId" className="text-gray-700 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctor *
              </Label>
              <Select value={formData.doctorId} onValueChange={(value) => handleInputChange('doctorId', value)}>
                <SelectTrigger className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl">
                  <SelectValue placeholder="Selecciona un doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: doctor.color }}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-sm text-gray-500">{doctor.specialty}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="serviceId" className="text-gray-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Servicio *
              </Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                <SelectTrigger className="h-12 bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl">
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{service.duration} min</span>
                          <span>•</span>
                          <span>S/ {service.price}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Summary */}
            {formData.startTime && selectedService && (
              <div className="p-4 bg-sakura-red/10 rounded-xl border border-sakura-red/20">
                <h4 className="font-medium text-gray-800 mb-2">Resumen de la Cita</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formData.startTime} - {calculateEndTime(formData.startTime, selectedService.duration)}
                    </span>
                    <span className="text-gray-500">
                      ({selectedService.duration} minutos)
                    </span>
                  </div>
                  {selectedDoctor && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedDoctor.color }}
                      />
                      <span>{selectedDoctor.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Costo: S/ {selectedService.price}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700">
                Notas (Opcional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales sobre la cita..."
                className="min-h-[80px] bg-white shadow-simple-shadow border-0 focus:border-sakura-red focus:ring-sakura-red/20 rounded-xl"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-sakura-red hover:bg-sakura-red-dark text-white rounded-xl shadow-simple-shadow"
              >
                Agendar Cita
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentForm; 