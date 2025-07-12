import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, ChevronLeft, ChevronRight, Calendar, Clock, User, Stethoscope, Loader2 } from 'lucide-react';
import { useAgendaStore, useEmployeeStore, usePatientStore, useServiceStore, type Appointment, type Employee, type Patient, type Service } from '@/shared/stores';
import { toast } from 'sonner';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

interface AgendaManagementProps {
  onBack: () => void;
}

const AgendaManagement: React.FC<AgendaManagementProps> = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const { 
    appointments, 
    isLoading: appointmentsLoading, 
    error: appointmentsError, 
    fetchAppointments, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment,
    clearError: clearAppointmentsError 
  } = useAgendaStore();

  const { 
    employees, 
    isLoading: employeesLoading, 
    error: employeesError, 
    fetchEmployees, 
    clearError: clearEmployeesError 
  } = useEmployeeStore();

  const { 
    patients, 
    isLoading: patientsLoading, 
    error: patientsError, 
    fetchPatients, 
    clearError: clearPatientsError 
  } = usePatientStore();

  const { 
    services, 
    isLoading: servicesLoading, 
    error: servicesError, 
    fetchServices, 
    clearError: clearServicesError 
  } = useServiceStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAppointments();
    fetchEmployees();
    fetchPatients();
    fetchServices();
  }, [fetchAppointments, fetchEmployees, fetchPatients, fetchServices]);

  // Manejar errores
  useEffect(() => {
    if (appointmentsError) {
      toast.error(appointmentsError);
      clearAppointmentsError();
    }
    if (employeesError) {
      toast.error(employeesError);
      clearEmployeesError();
    }
    if (patientsError) {
      toast.error(patientsError);
      clearPatientsError();
    }
    if (servicesError) {
      toast.error(servicesError);
      clearServicesError();
    }
  }, [appointmentsError, employeesError, patientsError, servicesError, clearAppointmentsError, clearEmployeesError, clearPatientsError, clearServicesError]);

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
        new Date(apt.appointment_date).toDateString() === date.toDateString()
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

  const handleAppointmentSubmit = async (appointmentData: any) => {
    try {
      await createAppointment(appointmentData);
      toast.success('Cita creada exitosamente');
      setShowAppointmentForm(false);
      setSelectedDate(null);
    } catch (error) {
      toast.error('Error al crear la cita');
    }
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

  const isLoading = appointmentsLoading || employeesLoading || patientsLoading || servicesLoading;

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
          className="bg-sakura-red hover:bg-sakura-red-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-sakura-red" />
          <span className="ml-2 text-sakura-gray">Cargando agenda...</span>
        </div>
      ) : (
        <>
          {/* Calendar Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold capitalize">
                    {formatMonthYear(currentDate)}
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Total: {appointments.length} citas</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                    } ${day.isToday ? 'bg-sakura-red/10 border-sakura-red' : ''}`}
                    onClick={() => handleDateClick(day.date)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.appointments.slice(0, 3).map((appointment) => {
                        const patient = patients.find(p => p.patient_id === appointment.patient_id);
                        const employee = employees.find(e => e.employee_id === appointment.employee_id);
                        return (
                          <div
                            key={appointment.appointment_id}
                            className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAppointmentClick(appointment);
                            }}
                          >
                            <div className="font-medium truncate">
                              {patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente'}
                            </div>
                            <div className="text-blue-600">
                              {appointment.start_time} - {employee ? `${employee.first_name} ${employee.last_name}` : 'Doctor'}
                            </div>
                          </div>
                        );
                      })}
                      {day.appointments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{day.appointments.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Citas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay citas programadas para hoy
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments
                    .filter(apt => new Date(apt.appointment_date).toDateString() === new Date().toDateString())
                    .map((appointment) => {
                      const patient = patients.find(p => p.patient_id === appointment.patient_id);
                      const employee = employees.find(e => e.employee_id === appointment.employee_id);
                      const service = services.find(s => s.service_id === appointment.service_id);
                      
                      return (
                        <div
                          key={appointment.appointment_id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-sakura-red" />
                              <span className="font-medium">
                                {patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600">
                                {employee ? `${employee.first_name} ${employee.last_name}` : 'Doctor'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-600">
                              {appointment.start_time} - {appointment.end_time}
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Appointment Modal */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdate={updateAppointment}
          onDelete={deleteAppointment}
          patients={patients}
          employees={employees}
          services={services}
        />
      )}
    </div>
  );
};

export default AgendaManagement; 