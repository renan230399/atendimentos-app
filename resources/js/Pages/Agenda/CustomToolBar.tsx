import React, { useState } from 'react';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircleSharp } from "react-icons/io5";
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';


const CustomToolbar = ({ label, onNavigate, date, onView, view }) => {
    const currentYear = moment(date).year();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const months = moment.months();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const views = {
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Agenda',
    };

    // Ajuste para manipular a navegação de maneira correta
    const handleNavigate = (action) => {
        let newDate;

        switch (view) {
            case 'month':
                newDate = moment(date)[action === 'PREV' ? 'subtract' : 'add'](1, 'months').toDate();
                break;
            case 'week':
                newDate = moment(date)[action === 'PREV' ? 'subtract' : 'add'](1, 'weeks').toDate();
                break;
            case 'day':
                newDate = moment(date)[action === 'PREV' ? 'subtract' : 'add'](1, 'days').toDate();
                break;
            case 'agenda':
                newDate = moment(date)[action === 'PREV' ? 'subtract' : 'add'](1, 'days').toDate();
                break;
            default:
                return;
        }

        onNavigate(newDate);
    };

    const handleMonthChange = (selectedDate) => {
        if (selectedDate instanceof Date) {
            setCurrentMonth(selectedDate);
            onNavigate(selectedDate); // Navega para o mês selecionado
        }
    };
    

    const handleYearChange = (e) => {
        const newYear = moment(date).year(e.target.value).toDate();
        onNavigate(newYear);
    };

    const handleViewChange = (value) => {
        if (Object.keys(views).includes(value)) {
            onView(value);
        }
    };

    return (
        <div className="flex xl:flex-col flex-wrap text-center items-center space-y-2">
            <div className="toolbar-label text-lg font-semibold hidden m-auto">
                {label}
            </div>

            <div className="flex items-center space-x-4">
                <IoPlaySkipBackCircleSharp 
                    onClick={() => handleNavigate('PREV')} 
                    className='w-10 h-10 text-blue-500 cursor-pointer hover:text-blue-600' 
                />
                <button 
                    type="button" 
                    onClick={() => onNavigate(new Date())} 
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Hoje
                </button>
                <BiSolidSkipNextCircle 
                    onClick={() => handleNavigate('NEXT')} 
                    className='w-10 h-10 text-blue-500 cursor-pointer hover:text-blue-600' 
                />
            </div>

            <div className="flex flex-wrap space-x-4">
                {Object.entries(views).map(([key, label]) => (
                    <button 
                        key={key}
                        onClick={() => handleViewChange(key)}
                        className={`p-2 m-auto rounded ${view === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap space-x-2 space-y-2">


                <div className="card flex justify-content-center">
                <Calendar 
    value={currentMonth} 
    onChange={(e) => handleMonthChange(e.value)} 
    view="month" 
    dateFormat="mm/yy" 
    showButtonBar 
/>


                </div>

            </div>
        </div>
    );
};

CustomToolbar.propTypes = {
    label: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    onView: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired
};

export default CustomToolbar;
