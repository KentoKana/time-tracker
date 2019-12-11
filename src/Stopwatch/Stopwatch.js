import React, { useRef, useState, useEffect, useCallback } from 'react';
import TimeDisplay from './TimeDisplay';
import EditableTimeDisplay from './EditableTimeDisplay';
import StopwatchButton from './StopwatchButton';

const Stopwatch = (props) => {
    //********************************//
    //***** Initialize Variables *****//
    //********************************//

    // Init timer variables
    let initialTime = useRef();
    let [elapsedTime, setElapsedTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    let timeInterval = useRef();
    let [isOn, setIsOn] = useState(false);

    // Keeps track of the time passed in milliseconds. 
    // Set this variable to change the displayed time.
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

    // Get Edited time
    let editedTime = useRef();
    const getEditedTime = (time) => {
        editedTime.current = time;
        return editedTime.current;
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

    const startStopwatch = useCallback(() => {
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
    }, [isOn]);

    const pauseStopwatch = useCallback(() => {
        if (timeInterval.current && isOn) {
            timeTracker.current = Date.now() - initialTime.current + timeTracker.current;
            initialTime.current = null;
            clearInterval(timeInterval.current);
            timeInterval.current = null;
        }
    }, [isOn]);

    const stopStopwatch = useCallback(() => {
        setIsOn(false);
        pauseStopwatch();
        timeTracker.current = 0;
        setElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
    }, [pauseStopwatch]);

    const handleIsOn = useCallback(() => {
        !isOn ? setIsOn(true) : setIsOn(false);
    }, [isOn]);

    //***** End Stopwatch Timer Logic *****//

    //****************************************//
    //***** Set Edit Status Logic Here *******//
    //****************************************//
    /**
    * Function to convert string time into MS
    * @param {string} timeString - time in string format (hh:mm:ss);
    */
    const convertTimeToMS = (timeString) => {
        let timeObj = { hours: 0, minutes: 0, seconds: 0 }
        if (timeString) {
            let timeArray = timeString.split(':');
            timeObj.hours = timeArray[0];
            timeObj.minutes = timeArray[1];
            timeObj.seconds = timeArray[2];
        }
        return (timeObj.hours * 3600000) + (timeObj.minutes * 60000) + (timeObj.seconds * 1000);
    }

    // State handler for determining whether or not the timer display is editable. 
    let [isEditable, setEditStatus] = useState(false);
    const handleEditStatus = useCallback((e) => {
        if (targetNode.current !== null && targetNode.current.contains(e.target)) {
            setIsOn(false);
            setEditStatus(true);
            pauseStopwatch();
        } else {
            if (isEditable) {
                timeTracker.current = convertTimeToMS(editedTime.current);
                let userEditedTime = convertMS(timeTracker.current)
                setElapsedTime(userEditedTime);
            } setEditStatus(false);
        }
        return isEditable;
    }, [isEditable, pauseStopwatch]);

    //****** End Edit Status Logic *******//

    // Function to render either the editable stopwatch display or the normal display
    const renderStopwatchDisplay = () => {
        if (isEditable) {
            return (
                <EditableTimeDisplay
                    targetNode={targetNode}
                    displayTime={displayTime.current}
                    setEditStatus={handleEditStatus}
                    isEditable={isEditable}
                    setElapsedTime={setElapsedTime}
                    getEditedTime={getEditedTime}
                />
            )

        } else {
            return (
                <TimeDisplay
                    setElapsedTime={elapsedTime}
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