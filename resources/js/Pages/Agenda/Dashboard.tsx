import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Backend para drag and drop
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomToolbar from '@/Pages/Agenda/CustomToolBar';
import EventPopup from '@/Pages/Agenda/EventPopup';
import EventAdd from '../EventAdd'; // Importando o modal ConsultationAdd
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { Dialog } from 'primereact/dialog';

import { User } from '@/types';
import {EventPatient, EventDefault} from './AgendaInterfaces'
interface DashboardProps {
    auth:{
        user:User
    };
    events: EventPatient[];
    forms?: any[];  // Ajuste conforme a tipagem de "forms" se necessário
  }

moment.locale('pt-br');

const Dashboard: React.FC<DashboardProps> = ({ auth, events: initialEvents, forms = [] }) => {
    const [events, setEvents] = useState<EventPatient[]>(
        initialEvents.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        }))
    );

    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<EventPatient | null>(null);
    const [newEventData, setNewEventData] = useState<{ start: Date; end: Date } | null>(null);
    const [eventPopupView, setEventPopupView] = useState(false);

    const handleEventClick = useCallback((event: EventPatient) => {
        setSelectedEvent(event);
        setEventPopupView(true);
    }, []);

    const handleEventClose = useCallback(() => {
        setSelectedEvent(null);
        setNewEventData(null); // Fecha o modal de novo evento
        setEventPopupView(false);
    }, []);

    const handleEventDelete = useCallback((eventId: number) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        setSelectedEvent(null);
    }, []);

    const handleViewChange = useCallback((view: any) => {
        if (view) setCurrentView(view);
    }, []);

    const handleNavigate = useCallback((newDate: Date) => {
        setCurrentDate(newDate);
    }, []);


    // Função para abrir o modal e criar um novo evento ao selecionar um slot
    const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
        if (currentView === Views.DAY) {
            setNewEventData({ start, end });
        }
    }, [currentView]);
/*
// Função para calcular o horário mínimo e máximo apenas para a visualização de dias
const { minTime, maxTime } = useMemo(() => {
    if (currentView !== Views.DAY) {
        // Corrigir para garantir que minTime e maxTime sejam do tipo Date
        return {
            minTime: new Date(new Date().setHours(0, 0, 0, 0)), // Instância de Date
            maxTime: new Date(new Date().setHours(23, 59, 59, 999)), // Instância de Date
        };
    }

    const todayEvents = events.filter(event => moment(event.start).isSame(currentDate, 'day'));

    if (todayEvents.length === 0) {
        return {
            minTime: new Date(new Date().setHours(6, 0, 0, 0)), // Instância de Date
            maxTime: new Date(new Date().setHours(23, 59, 59, 999)), // Instância de Date
        };
    }

    const eventStartTimes = todayEvents
        .map(event => event.start instanceof Date ? event.start.getTime() : NaN)
        .filter(time => !isNaN(time));

    const eventEndTimes = todayEvents
        .map(event => event.end instanceof Date ? event.end.getTime() : NaN)
        .filter(time => !isNaN(time));

    if (eventStartTimes.length === 0 || eventEndTimes.length === 0) {
        return {
            minTime: new Date(new Date().setHours(6, 0, 0, 0)), // Instância de Date
            maxTime: new Date(new Date().setHours(23, 59, 59, 999)), // Instância de Date
        };
    }

    const minEventTime = new Date(Math.min(...eventStartTimes));
    const maxEventTime = new Date(Math.max(...eventEndTimes));

    const eventDuration = (maxEventTime.getTime() - minEventTime.getTime()) / (1000 * 60 * 60);

    if (eventDuration < 12) {
        const hoursToAdd = (12 - eventDuration) / 2;
        const adjustedMinTime = new Date(minEventTime);
        adjustedMinTime.setHours(adjustedMinTime.getHours() - Math.floor(hoursToAdd));

        const adjustedMaxTime = new Date(maxEventTime);
        adjustedMaxTime.setHours(adjustedMaxTime.getHours() + Math.ceil(hoursToAdd));

        return { minTime: adjustedMinTime, maxTime: adjustedMaxTime };
    }

    return { minTime: minEventTime, maxTime: maxEventTime };
}, [events, currentDate, currentView]);
*/










    const label = currentView === Views.MONTH 
        ? moment(currentDate).format('MMMM YYYY') 
        : currentView === Views.WEEK 
        ? `Semana de ${moment(currentDate).startOf('week').format('D [de] MMMM')} a ${moment(currentDate).endOf('week').format('D [de] MMMM')}` 
        : moment(currentDate).format('D [de] MMMM YYYY');
        
    const localizer = momentLocalizer(moment);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Agenda" />
            <div className="h-screen">
                <div className='flex flex-wrap'>
                    <div 
                        className={`z-40 relative w-[100%] xl:w-[20%] h-[50%] p-4 transition-transform duration-300 m-auto ease-in-out `}>
                        <CustomToolbar
                            onView={handleViewChange}
                            label={label}
                            date={currentDate}
                            view={currentView}
                            onNavigate={handleNavigate}
                        />
                    </div>

                    <div className="z-30 w-[96%] xl:w-[77%] xl:h-[80vh] md:h-[80vh] m-auto xl:mx-0 h-[60vh]">
                        <div className="place-items-center m-auto text-center">
                            {label}
                        </div>
                        
                        <DndProvider backend={HTML5Backend}>
                            <Calendar
                                className="w-[95%] m-auto shadow-lg"
                                localizer={localizer}
                                events={events}
                                onSelectEvent={handleEventClick}
                                onSelectSlot={handleSelectSlot}  // Função para selecionar um intervalo e criar evento
                                selectable={currentView === Views.DAY}  // Selecionável apenas na view "day"
                                startAccessor="start"
                                endAccessor="end"
                                view={currentView}
                                date={currentDate}

                                onView={handleViewChange}
                                onNavigate={handleNavigate}
                                components={{ toolbar: () => null }}
                                messages={{
                                    allDay: 'Dia Inteiro',
                                    previous: 'Anterior',
                                    next: 'Próximo',
                                    today: 'Hoje',
                                    month: 'Mês',
                                    week: 'Semana',
                                    day: 'Dia',
                                    agenda: 'Agenda',
                                    date: 'Data',
                                    time: 'Hora',
                                    event: 'Evento',
                                    noEventsInRange: 'Não há eventos neste intervalo.',
                                    showMore: (total) => `+${total} mais`,
                                }}
                                formats={{
                                    timeGutterFormat: 'HH:mm',
                                    eventTimeRangeFormat: ({ start, end }, culture) => 
                                        `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                                    agendaTimeRangeFormat: ({ start, end }, culture) =>
                                        `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                                }}
                                
                                
                                
                            />
                        </DndProvider>
                    </div>
                    <Dialog  visible={eventPopupView}  className='w-[90vw] h-[90vh]' onHide={handleEventClose}>
                    {selectedEvent && (
                      <EventPopup
                            auth={auth}
                            selectedEvent={selectedEvent}
                            onClose={handleEventClose}
                            onDelete={handleEventDelete}
                            logo={auth.user.company.company_logo}
                            forms={forms}
                                />
                        )}
                    </Dialog>


                    {/*
                     Exibe o modal para adicionar um novo evento */}
                    {newEventData && (
                        <EventAdd
                            start={newEventData.start}
                            end={newEventData.end}
                            onClose={handleEventClose}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};


export default Dashboard;