import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomToolbar from '@/Pages/Agenda/CustomToolBar';
import EventPopup from '@/Pages/Agenda/EventPopup';
import PropTypes from 'prop-types';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

moment.updateLocale('pt-br', {
    weekdays: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    weekdaysShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    monthsShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
});

const Dashboard = ({ auth, events: initialEvents, forms = [], }) => {
    // Convertendo as datas de string para objetos Date
    const [events, setEvents] = useState(
        initialEvents.map(event => ({
            ...event,
            start: new Date(event.start), // Converte para objeto Date
            end: new Date(event.end), // Converte para objeto Date
        }))
    );

    const [currentView, setCurrentView] = useState(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalParams, setModalParams] = useState({});

    const handleEventClick = useCallback((event, e) => {
        setModalParams({ clientX: e.clientX, clientY: e.clientY });
        setSelectedEvent(event);
    }, []);

    const handleEventClose = useCallback(() => {
        setSelectedEvent(null);
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
                        className={`z-40 relative w-[100%] xl:w-[20%] h-[50%] bg-gray-200 p-4 transition-transform duration-300 m-auto ease-in-out `}
                    >
                        <CustomToolbar
                            onView={handleViewChange}
                            label={label}
                            date={currentDate}
                            view={currentView}
                            onNavigate={handleNavigate} // Adicionando onNavigate
                        />
 
                    </div>

                    <div className="z-30 w-[100%] xl:w-[77%] xl:h-[80vh] mx-5 xl:mx-0 h-[50vh]">
                        <div className="place-items-center">
                            {label}
                        </div>

                        <Calendar
                            localizer={localizer}
                            events={events}
                            onSelectEvent={handleEventClick}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            view={currentView}
                            date={currentDate}
                            onView={handleViewChange}
                            onNavigate={handleNavigate} // Adicionando onNavigate
                            components={{
                                toolbar: () => null
                            }}
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
