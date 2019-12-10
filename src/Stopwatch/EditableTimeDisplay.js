import React from 'react';

const EditableTimeDisplay =(props)=>{
    return (
        <input ref={props.targetNode} className="stopwatch__display" type="text" defaultValue={props.displayTime} />
    )
}

export default EditableTimeDisplay;