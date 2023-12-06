// @ts-ignore
import PropTypes from 'prop-types';
import React from 'react';


// @ts-ignore
import DateTimeDisplay from './dateTimeDisplay';

interface IShowCounterProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ShowCounter: React.FC<IShowCounterProps> = ({ days, hours, minutes, seconds }) => (
    <div className = 'show-counter'>
        <DateTimeDisplay
            isDanger = { days <= 3 }
            type = { 'Days' }
            value = { days } />
        <p>:</p>
        <DateTimeDisplay
            isDanger = { false }
            type = { 'Hours' }
            value = { hours } />
        <p>:</p>
        <DateTimeDisplay
            isDanger = { false }
            type = { 'Mins' }
            value = { minutes } />
        <p>:</p>
        <DateTimeDisplay
            isDanger = { false }
            type = { 'Seconds' }
            value = { seconds } />
    </div>
);

ShowCounter.propTypes = {
    days: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired
};

export { ShowCounter };
