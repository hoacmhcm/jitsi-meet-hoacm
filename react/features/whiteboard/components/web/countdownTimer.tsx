// @ts-ignore
import PropTypes from 'prop-types';
import React from 'react';


// @ts-ignore
import { ExpiredNotice } from './expiredNotice';
import { ShowCounter } from './showCounter';
import { useCountdown } from './useCountdown';

interface ICountdownTimerProps {
    targetDate: Date | number;
}

const CountdownTimer: React.FC<ICountdownTimerProps> = ({ targetDate }) => {
    const [ days, hours, minutes, seconds ] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <ExpiredNotice />;
    }

    return (
        <ShowCounter
            days = { days }
            hours = { hours }
            minutes = { minutes }
            seconds = { seconds } />
    );
};

CountdownTimer.propTypes = {
    targetDate: PropTypes.instanceOf(Date).isRequired
};

export { CountdownTimer };
