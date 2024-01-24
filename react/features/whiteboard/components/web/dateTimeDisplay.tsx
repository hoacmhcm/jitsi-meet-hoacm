// @ts-ignore
import PropTypes from 'prop-types';
import React from 'react';

// @ts-ignore

const DateTimeDisplay = ({ value, isDanger }) => (
    <div className = { isDanger ? 'countdown danger' : 'countdown' }>
        <p>{value}</p>
    </div>
);

DateTimeDisplay.propTypes = {
    isDanger: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

export default DateTimeDisplay;
