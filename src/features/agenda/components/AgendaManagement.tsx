import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, ChevronLeft, ChevronRight, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Appointment, Doctor, Patient, Service, CalendarDay } from '../types';
import AppointmentForm from './AppointmentForm';
import AppointmentModal from './AppointmentModal';

interface AgendaManagementProps {
  onBack: () => void;
}

const AgendaManagement: React.FC<AgendaManagementProps> = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Mock data
  const mockDoctors: Doctor[] = [
    { id: '1', name: 'Dr. Ana García', specialty: 'Ortodoncia', color: '#FF6B6B' },
    { id: '2', name: 'Dr. Carlos Ruiz', specialty: 'Endodoncia', color: '#4ECDC4' },
    { id: '3', name: 'Dr. María López', specialty: 'Cirugía Oral', color: '#45B7D1' },
    { id: '4', name: 'Dr. Roberto Silva', specialty: 'Periodoncia', color: '#96CEB4' },
    { id: '5', name: 'Dr. Elena Martín', specialty: 'Estética Dental', color: '#FFEAA7' },
  ];

  const mockPatients: Patient[] = [
    { id: '1', name: 'María Antonieta Lugo', phone: '987-654-321', dni: '12345678' },
    { id: '2', name: 'Carlos Mariano Justo', phone: '987-654-322', dni: '87654321' },
    { id: '3', name: 'Ana Sofía Pérez', phone: '987-654-323', dni: '11223344' },
    { id: '4', name: 'Luis Fernando Torres', phone: '987-654-324', dni: '44332211' },
  ];

  const mockServices: Service[] = [
    { id: '1', name: 'Consulta General', duration: 30, price: 80 },
    { id: '2', name: 'Limpieza Dental', duration: 60, price: 120 },
    { id: '3', name: 'Ortodoncia - Consulta', duration: 45, price: 150 },
    { id: '4', name: 'Endodoncia', duration: 90, price: 350 },
    { id: '5', name: 'Blanqueamiento', duration: 60, price: 200 },
  ];

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      serviceId: '1',
      date: new Date(2024, 11, 15),
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      notes: 'Primera consulta',
    },
    {
      id: '2',
      patientId: '2',
      doctorId: '2',
      serviceId: '4',
      date: new Date(2024, 11, 15),
      startTime: '10:00',
      endTime: '11:30',
      status: 'scheduled',
      notes: 'Tratamiento de conducto',
    },
    {
      id: '3',
      patientId: '3',
      doctorId: '3',
      serviceId: '2',
      date: new Date(2024, 11, 16),
      startTime: '14:00',
      endTime: '15:00',
      status: 'scheduled',
    },
  ];

  useEffect(() => {
    // Initialize with mock data
    const appointmentsWithDetails = mockAppointments.map(appointment => ({
      ...appointment,
      patient: mockPatients.find(p => p.id === appointment.patientId),
      doctor: mockDoctors.find(d => d.id === appointment.doctorId),
      service: mockServices.find(s => s.id === appointment.serviceId),
    }));
    setAppointments(appointmentsWithDetails);
  }, []);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, appointments]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayAppointments = appointments.filter(apt => 
        apt.date.toDateString() === date.toDateString()
      );
      
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        appointments: dayAppointments,
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAppointmentForm(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleAppointmentSubmit = (appointmentData: any) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...appointmentData,
      date: new Date(appointmentData.date),
      endTime: calculateEndTime(appointmentData.startTime, appointmentData.serviceId),
      status: 'scheduled' as const,
      patient: mockPatients.find(p => p.id === appointmentData.patientId),
      doctor: mockDoctors.find(d => d.id === appointmentData.doctorId),
      service: mockServices.find(s => s.id === appointmentData.serviceId),
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowAppointmentForm(false);
    setSelectedDate(null);
  };

  const calculateEndTime = (startTime: string, serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (!service) return startTime;
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-sakura-red hover:bg-sakura-red/10"
          >
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        </div>
        <Button
          onClick={() => setShowAppointmentForm(true)}
          className="bg-sakura-red hover:bg-sakura-red-dark text-white shadow-simple-shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Calendar */}
      <Card className="shadow-simple-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800 capitalize">
              {formatMonthYear(currentDate)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-[80px] p-1 border border-gray-200 rounded-lg cursor-pointer
                  hover:bg-gray-50 transition-colors
                  ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${day.isToday ? 'bg-sakura-red/10 border-sakura-red' : ''}
                `}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="text-sm font-medium mb-1">
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.appointments.slice(0, 2).map(appointment => (
                    <div
                      key={appointment.id}
                      className="text-xs p-1 rounded text-white cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: appointment.doctor?.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(appointment);
                      }}
                    >
                      {appointment.startTime} - {appointment.patient?.name}
                    </div>
                  ))}
                  {day.appointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{day.appointments.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card className="shadow-simple-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Citas de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments
              .filter(apt => apt.date.toDateString() === new Date().toDateString())
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(appointment => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: appointment.doctor?.color }}
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {appointment.patient?.name}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {appointment.doctor?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status === 'scheduled' ? 'Programada' : appointment.status}
                  </Badge>
                </div>
              ))}
            {appointments.filter(apt => apt.date.toDateString() === new Date().toDateString()).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No hay citas programadas para hoy
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <AppointmentForm
          selectedDate={selectedDate}
          doctors={mockDoctors}
          patients={mockPatients}
          services={mockServices}
          onSubmit={handleAppointmentSubmit}
          onClose={() => {
            setShowAppointmentForm(false);
            setSelectedDate(null);
          }}
        />
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onEdit={(appointment) => {
            // TODO: Implement edit functionality
            console.log('Edit appointment:', appointment);
          }}
          onDelete={(appointmentId) => {
            setAppointments(appointments.filter(apt => apt.id !== appointmentId));
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default AgendaManagement; 