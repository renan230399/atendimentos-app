import React, { useState } from 'react';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircleSharp } from "react-icons/io5";
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
interface CustomToolbarProps {
    label: string;
    onNavigate: (newDate: Date) => void;
    date: Date;
    onView: (view: string) => void;
    view: string;
  }
const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, date, onView, view }) => {
    const currentYear = moment(date).year();
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const months = moment.months();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const views = {
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Agenda',
    };

    const handleNavigate = (action: 'PREV' | 'NEXT') => {
        let newDate: Date;

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

    const handleMonthChange = (selectedDate: Date | undefined) => {
        if (selectedDate instanceof Date) {
            setCurrentMonth(selectedDate);
            onNavigate(selectedDate); // Navega para o mês selecionado
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = moment(date).year(parseInt(e.target.value)).toDate();
        onNavigate(newYear);
    };

    const handleViewChange = (value: string) => {
        if (Object.keys(views).includes(value)) {
            onView(value);
        }
    };

    return (
        <div className="flex xl:flex-col flex-wrap text-center items-center space-y-2">
            <div className="toolbar-label text-lg font-semibold m-auto">
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

            
        </div>
    );
};

export default CustomToolbar;
