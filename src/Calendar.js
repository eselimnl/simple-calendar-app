import { useState, useEffect } from 'react';
import './Calendar.css';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar() {
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [distantDays, setDistantDays] = useState(new Set());
  const [maxTicks, setMaxTicks] = useState(24);
  const [tickCount, setTickCount] = useState(0);
  const [distantCount, setDistantCount] = useState(0);

  useEffect(() => {
    setTickCount(selectedDays.size);
    setDistantCount(distantDays.size);
  }, [selectedDays, distantDays]);

  const getFirstDayOfMonth = (monthIndex) => {
    const date = new Date(2025, monthIndex, 1);
    // Adjust to make Monday the first day of the week (0 = Monday, 6 = Sunday)
    return (date.getDay() + 6) % 7;
  };

  const handleDayClick = (monthIndex, day) => {
    const key = `${monthIndex}-${day}`;
    if (distantDays.has(key)) return;

    setSelectedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else if (tickCount < maxTicks) {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleDistantClick = (e, monthIndex, day) => {
    e.preventDefault();
    const key = `${monthIndex}-${day}`;
    if (selectedDays.has(key)) return;

    setDistantDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else if (distantCount < 10) {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="calendar-app">
      <h1>Your 2025 Annual Leave Calendar</h1>
      
      <div className="counter-container">
        <label>
          Allowed Ticks: 
          <input 
            type="number" 
            value={maxTicks}
            min="1"
            onChange={(e) => setMaxTicks(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>
        <p>Current Ticks: <span>{tickCount}</span></p>
        <p>Distant Work Days: <span>{distantCount}/10</span></p>
      </div>

      <div className="calendar-container">
        {months.map((month, monthIndex) => {
          const firstDay = getFirstDayOfMonth(monthIndex);
          return (
            <div key={month} className="month">
              <h3>{month} 2025</h3>
              <div className="weekdays">
                {weekdays.map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="days-grid">
                {/* Empty cells for days before the first day of the month */}
                {Array(firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="day empty"></div>
                ))}
                
                {Array.from({ length: daysInMonth[monthIndex] }, (_, i) => {
                  const day = i + 1;
                  const key = `${monthIndex}-${day}`;
                  const isSelected = selectedDays.has(key);
                  const isDistant = distantDays.has(key);
                  
                  return (
                    <div
                      key={day}
                      className={`day 
                        ${isSelected ? 'selected' : ''} 
                        ${isDistant ? 'distant' : ''}
                      `}
                      onClick={() => handleDayClick(monthIndex, day)}
                      onContextMenu={(e) => handleDistantClick(e, monthIndex, day)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}