import React, { useRef, useState, useEffect } from 'react';
import TimeDisplay from './TimeDisplay';
import EditableTimeDisplay from './EditableTimeDisplay';
import StopwatchButton from './StopwatchButton';


const Stopwatch = (props) => {
    //********************************//
    //***** Initialize Variables *****//
    //********************************//

    // Init timer variables
    let initialTime = useRef();
    let [elapsedTime, setElapsedTime] = useState(0);
    let timeInterval = useRef();
    let [isOn, setIsOn] = useState(false);

    // Keeps track of elapsed time when stopwatch is paused.
    let timeTracker = useRef();
    timeTracker.current = timeTracker.current ? timeTracker.current : 0;

    // Init target node variable
    const targetNode = useRef();

    // Init current Display Time variable
    let displayTime = useRef();

    // Function to get current Display Time
    const getDisplayTime = (currentTime) => {
        return displayTime.current = currentTime;
    }

    //*********************************************//
    //***** Stopwatch Timer Logic Starts Here *****//
    //*********************************************//

    /**
	 * Function to convert ms to other formats (s, m, h)
	 * @param {int} duration - time in milliseconds.
	*/
    const convertMS = (duration) => {

        let timeObj = {
            hours: 0,
            minutes: 0,
            seconds: 0,
        }

        timeObj.seconds = Math.floor((duration / 1000) % 60);
        timeObj.minutes = Math.floor((duration / (1000 * 60)) % 60);
        timeObj.hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        return timeObj;
    }

    const startStopwatch = () => {
        if (!isOn) {
            if (!initialTime.current) {
                // Get the UTC time at the time of starting the timer
                initialTime.current = Date.now();
            }
            // Get the difference between initial UTC time and current UTC time.
            if (!timeInterval.current) {
                timeInterval.current = setInterval(() => {
                    let timePassed = convertMS(Date.now() - initialTime.current + timeTracker.current)
                    setElapsedTime(timePassed);
                }, 1000)
            }
        }
    }

    const pauseStopwatch = () => {
        if (timeInterval.current && isOn) {
            timeTracker.current = Date.now() - initialTime.current + timeTracker.current;
            initialTime.current = null;
            clearInterval(timeInterval.current);
            timeInterval.current = null;
        }
    }

    const stopStopwatch = () => {
        setIsOn(false);
        pauseStopwatch();
        timeTracker.current = 0;
        setElapsedTime(0);
    }

    const handleIsOn = () => {
        !isOn ? setIsOn(true) : setIsOn(false);
    }

    //***** End Stopwatch Timer Logic *****//

    //****************************************//
    //***** Set Edit Status Logic Here *******//
    //****************************************//

    // State handler for determining whether or not the timer display is editable.
    let [isEditable, setEditStatus] = useState(false);
    const handleEditStatus = (e) => {
        if (targetNode.current !== null && targetNode.current.contains(e.target)) {
            setIsOn(false);
            setEditStatus(true);
            pauseStopwatch();
            return isEditable;
        } else {
            setEditStatus(false);
        }
    }
    //****** End Edit Status Logic *******//

    // Function to render either the editable stopwatch display or the normal display
    const renderStopwatchDisplay = () => {
        if (isEditable) {
            return (
                <EditableTimeDisplay
                    targetNode={targetNode}
                    displayTime={displayTime.current}
                />
            )

        } else {
            return (
                <TimeDisplay
                    getElapsedTime={elapsedTime}
                    targetNode={targetNode}
                    isEditable={isEditable}
                    setEditStatus={handleEditStatus}
                    displayTime={getDisplayTime}
                />
            )
        }
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleEditStatus);  // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleEditStatus);
        };
    }, [handleEditStatus]);

    return (
        <>
            {renderStopwatchDisplay()}
            <StopwatchButton
                startStopwatch={startStopwatch}
                pauseStopwatch={pauseStopwatch}
                stopStopwatch={stopStopwatch}
                isEditable={isEditable}
                toggleIsOn={handleIsOn}
                isOn={isOn}
            />
        </>
    );
}

export default Stopwatch;