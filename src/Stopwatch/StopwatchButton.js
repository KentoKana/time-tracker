import React, { useRef } from 'react'

const StopwatchButton = (props) => {

    //********************************//
    //***** Initialize Variables *****//
    //********************************//

    let label = useRef();
    let className = 'stopwatch__btn';
    let modClassName = useRef();

    //********************************//
    //***** Btn Handler Functions ****//
    //********************************//

    const handleStartPauseBtnClick = () => {
        if (props.isOn === false) {
            props.toggleIsOn();
            props.startStopwatch();
        } else {
            props.toggleIsOn();
            props.pauseStopwatch();
        }
    }

    const handleStopBtnClick = () => {
        label.current = <i className="fas fa-play"></i>
        modClassName.current = '--start';
        props.stopStopwatch();
    }

    const toggleBtnStyling = () => {
        if (props.isOn === false) {
            label.current = <i className="fas fa-play"></i>
            modClassName.current = '--start';
        } else {
            label.current = <i className="fas fa-pause"></i>
            modClassName.current = '--pause';
        }
    }

    toggleBtnStyling();

    return (
        <>
            <button className={` ${className} ${className + modClassName.current}`} onClick={handleStartPauseBtnClick}>
                {label.current}
            </button>
            <button className={`${className} ${className}--stop`} onClick={handleStopBtnClick}>
                <i className="fas fa-stop"></i>
            </button>
        </>
    );
}

export default StopwatchButton;