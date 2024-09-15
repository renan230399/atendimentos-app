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

const Dashboard = ({ auth, events: initialEvents }) => {
    // Convertendo eventos iniciais para garantir que start e end sejam objetos Date
    const [events, setEvents] = useState(
        initialEvents.map(event => ({
            ...event,
            start: new Date(event.start.replace(' ', 'T')),
            end: new Date(event.end.replace(' ', 'T'))
        }))
    );

    const [currentView, setCurrentView] = useState(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [modalParams, setModalParams] = useState({});
    
    // Controle de visibilidade da barra de ferramentas para dispositivos menores
    const [showToolbar, setShowToolbar] = useState(false);
    const handleOpenWindow = () => {
        // Especifica a URL, o nome da janela, e os parâmetros de estilo
        const url = 'http://localhost/agenda'; // Altere para a URL que você deseja abrir
        const windowName = 'MiniJanela'; // Nome da janela
        const windowFeatures = 'width=1000,height=1000,resizable,scrollbars=yes,status=1'; // Parâmetros da janela

        // Abre uma nova janela com os parâmetros especificados
        window.open(url, windowName, windowFeatures);
    };
    const handleSelectSlot = useCallback((slotInfo) => {
        const title = window.prompt('Novo Evento:');
        if (title) {
            const newEvent = {
                id: events.length + 1,
                title,
                start: new Date(slotInfo.start),
                end: new Date(slotInfo.end),
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    }, [events]);

    const handleEventClick = useCallback((event, e) => {
        setModalParams({ clientX: e.clientX, clientY: e.clientY });
        setEventoSelecionado(event);
    }, []);

    const handleEventClose = useCallback(() => {
        setEventoSelecionado(null);
    }, []);

    const handleEventDelete = useCallback((eventId) => {
        setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
        setEventoSelecionado(null);
    }, []);

    const handleNavigate = useCallback((action, date) => {
        if (action === 'date') {
            setCurrentDate(date);
        } else if (action === 'TODAY') {
            setCurrentDate(new Date());
        } else {
            setCurrentDate(moment(currentDate).add(action === 'PREV' ? -1 : 1, currentView).toDate());
        }
    }, [currentDate, currentView]);

    const handleViewChange = useCallback((view) => {
        if (view) {
            setCurrentView(view);
        }
    }, []);

    const handleToggleToolbar = () => {
        setShowToolbar(!showToolbar);
    };

    const label = currentView === Views.MONTH 
        ? moment(currentDate).format('MMMM YYYY') 
        : currentView === Views.WEEK 
        ? `Semana de ${moment(currentDate).startOf('week').format('D [de] MMMM')} a ${moment(currentDate).endOf('week').format('D [de] MMMM')}` 
        : moment(currentDate).format('D [de] MMMM YYYY');
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Agenda" />
            <div className="h-screen">
                {/* Botão para mostrar/esconder a barra de ferramentas somente em dispositivos menores */}
  
                <div className='flex flex-wrap'>
                <div 
                    className={`z-40 relative w-[100%] md:w-[20%] h-[50%] bg-gray-200 p-4 transition-transform duration-300 m-auto ease-in-out `}
                >
                        
                    <CustomToolbar
                        onNavigate={handleNavigate}
                        onView={handleViewChange}
                        label={label}
                        date={currentDate}
                        view={currentView}
                    />
                </div>
                
                <div className="z-30 w-[100%] md:w-[77%] md:h-[80vh] p-0 h-[50vh]">
                    <div className="place-items-center">
                        {label}
                    </div>
                    <div className="md:hidden relative z-50 top-2 right-2">
                        <button 
                            onClick={handleToggleToolbar} 
                            className="bg-blue-500 text-white px-4 py-2 rounded">
                            {showToolbar ? 'Esconder Barra' : 'Mostrar Barra'}
                        </button>
                    </div>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleEventClick}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        view={currentView}
                        date={currentDate}
                        onNavigate={handleNavigate}
                        onView={handleViewChange}
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
                                `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
                        }}
                    />
                        <div>
            <button onClick={handleOpenWindow}>
                Abrir Mini Janela
            </button>
        </div>
                </div>
            
                {eventoSelecionado && (
                    <EventPopup
                        eventoSelecionado={eventoSelecionado}
                        params={modalParams}
                        onClose={handleEventClose}
                        onDelete={handleEventDelete}
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
