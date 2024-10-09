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
import EventAdd from './EventAdd'; // Importando o modal ConsultationAdd
import PropTypes from 'prop-types';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar); // Envolve o Calendar com suporte a Drag and Drop

const Dashboard = ({ auth, events: initialEvents, forms = [], }) => {
    const [events, setEvents] = useState(
        initialEvents.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        }))
    );

    const [currentView, setCurrentView] = useState(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalParams, setModalParams] = useState({});
    const [newEventData, setNewEventData] = useState(null); // Estado para armazenar os dados do novo evento

    const handleEventClick = useCallback((event, e) => {
        setModalParams({ clientX: e.clientX, clientY: e.clientY });
        setSelectedEvent(event);
    }, []);

    const handleEventClose = useCallback(() => {
        setSelectedEvent(null);
        setNewEventData(null); // Fecha o modal de novo evento
    }, []);

    const handleEventDelete = useCallback((eventId) => {
        setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
        setSelectedEvent(null);
    }, []);

    const handleViewChange = useCallback((view) => {
        if (view) {
            setCurrentView(view);
        }
    }, []);

    const handleNavigate = useCallback((newDate) => {
        setCurrentDate(newDate);
    }, []);

    const handleEventResize = useCallback(({ event, start, end }) => {
        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });
        setEvents(nextEvents);
    }, [events]);

    const handleEventDrop = useCallback(({ event, start, end }) => {
        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });
        setEvents(nextEvents);
    }, [events]);

    // Função para abrir o modal e criar um novo evento ao selecionar um slot
    const handleSelectSlot = useCallback(({ start, end }) => {
        if (currentView === Views.DAY) {
            // Abre o modal com os dados de início e fim
            setNewEventData({ start, end });
        }
    }, [currentView]);

    // Função para adicionar o novo evento ao calendário após o formulário ser submetido
    const handleAddNewEvent = useCallback((eventDetails) => {
        const newEvent = {
            id: events.length + 1,  // Gera um ID simples para o evento
            title: eventDetails.title,  // Título obtido do modal
            start: eventDetails.start,
            end: eventDetails.end,
        };
        setEvents([...events, newEvent]);  // Adiciona o novo evento à lista
        setNewEventData(null);  // Fecha o modal após a criação do evento
    }, [events]);

// Função para calcular o horário mínimo e máximo apenas para a visualização de dias
const { minTime, maxTime } = useMemo(() => {
    // Só aplica a lógica quando a visualização atual for de dias
    if (currentView !== Views.DAY) {
        return { minTime: new Date().setHours(0, 0, 0), maxTime: new Date().setHours(23, 59, 59) }; // Horários padrão para outras views
    }

    const todayEvents = events.filter(event => moment(event.start).isSame(currentDate, 'day'));
    if (todayEvents.length === 0) {
        return {
            minTime: new Date().setHours(6, 0, 0), // Define 6 AM como horário padrão se não houver eventos no dia
            maxTime: new Date().setHours(23, 59, 59),
        };
    }

    const minEventTime = new Date(Math.min(...todayEvents.map(event => event.start.getTime())));
    const maxEventTime = new Date(Math.max(...todayEvents.map(event => event.end.getTime())));

    // Calcula a diferença em horas entre os horários mínimo e máximo dos eventos
    const eventDuration = (maxEventTime - minEventTime) / (1000 * 60 * 60); // Diferença em horas

    // Se a duração dos eventos for menor que 12 horas, ajusta os horários para mostrar um intervalo de pelo menos 12 horas
    if (eventDuration < 12) {
        const hoursToAdd = (12 - eventDuration) / 2;
        const adjustedMinTime = new Date(minEventTime);
        adjustedMinTime.setHours(adjustedMinTime.getHours() - Math.floor(hoursToAdd));

        const adjustedMaxTime = new Date(maxEventTime);
        adjustedMaxTime.setHours(adjustedMaxTime.getHours() + Math.ceil(hoursToAdd));

        return { minTime: adjustedMinTime, maxTime: adjustedMaxTime };
    }

    // Se a duração dos eventos for maior ou igual a 12 horas, usa os horários dos eventos normalmente
    return { minTime: minEventTime, maxTime: maxEventTime };
}, [events, currentDate, currentView]);



    const label = currentView === Views.MONTH 
        ? moment(currentDate).format('MMMM YYYY') 
        : currentView === Views.WEEK 
        ? `Semana de ${moment(currentDate).startOf('week').format('D [de] MMMM')} a ${moment(currentDate).endOf('week').format('D [de] MMMM')}` 
        : moment(currentDate).format('D [de] MMMM YYYY');

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

                    <div className="z-30 w-[96%] xl:w-[77%] xl:h-[80vh] md:h-[80vh] m-auto xl:mx-0 h-[50vh]">
                        <div className="place-items-center m-auto text-center">
                            {label}
                        </div>
                        
                        <DndProvider backend={HTML5Backend}>
                            <DragAndDropCalendar
                                className="w-[95%] m-auto shadow-lg"
                                localizer={localizer}
                                events={events}
                                onSelectEvent={handleEventClick}
                                onEventDrop={handleEventDrop} // Função para Drag and Drop
                                onEventResize={handleEventResize} // Função para redimensionar eventos
                                onSelectSlot={handleSelectSlot}  // Função para selecionar um intervalo e criar evento
                                selectable={currentView === Views.DAY}  // Selecionável apenas na view "day"
                                resizable
                                startAccessor="start"
                                endAccessor="end"
                                view={currentView}
                                date={currentDate}
                                min={minTime}  // Horário mínimo exibido
                                max={maxTime}  // Horário máximo exibido
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
                                    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                                        `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                                    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                                        `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                                }}
                            />
                        </DndProvider>
                    </div>

                    {selectedEvent && (
                        <EventPopup
                            auth={auth}
                            selectedEvent={selectedEvent}
                            params={modalParams}
                            onClose={handleEventClose}
                            onDelete={handleEventDelete}
                            logo={auth.user.company.company_logo}
                            forms={forms}
                        />
                    )}

                    {/* Exibe o modal para adicionar um novo evento */}
                    {newEventData && (
                        <EventAdd
                            start={newEventData.start}
                            end={newEventData.end}
                            onClose={handleEventClose}
                            onSave={handleAddNewEvent}  // Função para salvar o novo evento
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    events: PropTypes.array.isRequired,
};

export default Dashboard;