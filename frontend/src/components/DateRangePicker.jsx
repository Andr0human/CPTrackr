import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import '../styles/DateRangePicker.css';

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  return (
    <div className='date-range-container'>
      <h4 className='date-range-title'>Date Range</h4>
      <div className='date-range-picker'>
        <div className='date-input-wrapper'>
          <div className='date-input-group'>
            <FaCalendarAlt className='calendar-icon' />
            <div className='date-field'>
              <label>From</label>
              <input
                type='date'
                value={startDate}
                onChange={(e) => onDateChange([e.target.value, endDate])}
                className='date-input'
                placeholder='dd-mm-yyyy'
              />
            </div>
          </div>
          
          <div className='date-input-group'>
            <FaCalendarAlt className='calendar-icon' />
            <div className='date-field'>
              <label>To</label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => onDateChange([startDate, e.target.value])}
                className='date-input'
                placeholder='dd-mm-yyyy'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker; 