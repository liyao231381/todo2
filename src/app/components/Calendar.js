// src/app/components/Calendar.js
import React from 'react';
import { useState } from 'react';
import './Calendar.css';

const Calendar = ({ todos, onDateSelect }) => { // 添加 onDateSelect prop
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();
        const firstDay = getFirstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);
        const weeks = [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let day = 1;
        let daysRow = [];

        for (let i = 0; i < firstDay; i++) {
            daysRow.push(<div className="day empty" key={`empty-start-${i}`}></div>);
        }

        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(year, month, day);
            const isPastDay = currentDate < today;
            const isToday = currentDate.getTime() === today.getTime();

            const todosForDay = todos.filter(todo => {
                const todoDate = new Date(todo.dueDate);
                return todoDate.getDate() === day && todoDate.getMonth() === month && todoDate.getFullYear() === year;
            });

            daysRow.push(
                <div
                    className={`day ${isPastDay ? 'past-day' : ''} ${isToday ? 'today' : ''}`}
                    key={`day-${day}`}
                    onClick={() => onDateSelect(currentDate)} // 点击日期时触发 onDateSelect
                >
                    {day}
                    {todosForDay.length > 0 && <span className="todo-count">({todosForDay.length})</span>}
                </div>
            );

            if ((firstDay + day) % 7 === 0) {
                weeks.push(<div className="week" key={`week-${day}`}>{daysRow}</div>);
                daysRow = [];
            }

            day++;
        }

        while (daysRow.length > 0 && daysRow.length < 7) {
            daysRow.push(<div className="day empty" key={`empty-end-${daysRow.length}`}></div>);
        }

        if(daysRow.length > 0){
            weeks.push(<div className="week" key={`week-${day}`}>{daysRow}</div>);
        }

        return weeks;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>上一月</button>
                <h2>{year}年{month}月</h2>
                <button onClick={handleNextMonth}>下一月</button>
            </div>
            <div className="calendar-body">
                <div className="day-name-row">
                    <div className="day-name">日</div>
                    <div className="day-name">一</div>
                    <div className="day-name">二</div>
                    <div className="day-name">三</div>
                    <div className="day-name">四</div>
                    <div className="day-name">五</div>
                    <div className="day-name">六</div>
                </div>
                {renderCalendar()}
            </div>
        </div>
    );
};

export default Calendar;
