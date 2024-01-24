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

const ShowCounter: React.FC<IShowCounterProps> = ({ hours, minutes, seconds }) => (
    <>
        <div className = 'counter-title'>Thời gian bài kiểm tra còn</div>
        <div className = 'show-counter'>
            <DateTimeDisplay
                isDanger = { false }
                value = { hours } />
            <p>:</p>
            <DateTimeDisplay
                isDanger = { false }
                value = { minutes } />
            <p>:</p>
            <DateTimeDisplay
                isDanger = { false }
                value = { seconds } />
        </div>
    </>
);

ShowCounter.propTypes = {
    days: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired
};

export { ShowCounter };
