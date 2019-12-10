import React, { useRef } from 'react';

const TimeDisplay = (props) => {

    //********************************//
    //***** Initialize Variables *****//
    //********************************//
    let timeObj;
    let display = useRef();
    display.current = "00:00:00";

    //*************************************//
    //***** Display Formatter Function ****//
    //*************************************//

    /**
	 * Function to format time.
	 * @param {Object} timeObj - object in the the following format {hours:h, minutes:m, seconds:s}
	*/
    const formatTime = (timeObj) => {

        if (!timeObj) {
            timeObj = {
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        Object.keys(timeObj).forEach(e => {
            // Refactor this so that it's not doing a Regex check every render.
            let regex = /^0[0-9].*$/
            if (timeObj[e] < 10 && !regex.test(timeObj[e])) {
                timeObj[e] = "0" + timeObj[e];
            }
        });

        return timeObj;
    }

    timeObj = formatTime(props.getElapsedTime);
    display.current = `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`;
    props.displayTime(display.current);

    return (
        <>
            <span className="stopwatch__display" ref={props.targetNode} onClick={props.setEditStatus}>{display.current}</span>
        </>
    );
}

export default TimeDisplay;