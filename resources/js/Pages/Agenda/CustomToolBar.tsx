// CustomToolbar.jsx
import React from 'react';
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPlaySkipBackCircleSharp } from "react-icons/io5";
import PropTypes from 'prop-types';
import CustomSelect from '@/Components/CustomSelect';
import moment from 'moment';

const CustomToolbar = ({ label, onNavigate, date, onView, view }) => {
    const currentYear = moment(date).year();
    const currentMonth = moment(date).month();
    const months = moment.months();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const views = {
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Agenda', // Adicionado ao conjunto de visualizações
    };

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        const newDate = moment(date).month(newMonth).toDate();
        onNavigate('date', newDate);
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        const newDate = moment(date).year(newYear).toDate();
        onNavigate('date', newDate);
    };

    const handleViewChange = (value) => {
        if (Object.keys(views).includes(value)) {
            onView(value);
        }
    };

    return (
        <div className="">
            <div className="toolbar-label text-lg font-semibold mt-4 text-center">
                {label}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-3 place-items-center gap-6">
                <IoPlaySkipBackCircleSharp onClick={() => onNavigate('PREV')} className='w-10 h-10 text-blue-500 cursor-pointer' />
                <button type="button" onClick={() => onNavigate('TODAY')}>Hoje</button>
                <BiSolidSkipNextCircle onClick={() => onNavigate('NEXT')} className='w-10 h-10 text-blue-500 cursor-pointer' />
            </div>
            <div className="toolbar mt-4">
                <CustomSelect 
                    options={Object.entries(views).map(([key, value]) => ({ value: key, label: value }))}
                    onChange={handleViewChange} 
                    value={view}
                />
                <button onClick={() => handleViewChange('agenda')} className="ml-2 p-2 bg-blue-500 text-white rounded">
                    Agenda
                </button>

                <select onChange={handleMonthChange} value={currentMonth} className="ml-2 border rounded p-1">
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>
                <select onChange={handleYearChange} value={currentYear} className="ml-2 border rounded p-1">
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

CustomToolbar.propTypes = {
    label: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
    date: PropTypes.object.isRequired,
    onView: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired
};

export default CustomToolbar;
