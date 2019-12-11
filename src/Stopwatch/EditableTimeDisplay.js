import React, { useState } from 'react';

const EditableTimeDisplay = (props) => {
    const handleKeyPress = (e) => {
        //change edit status when enter key is pressed.
        if (e.key === "Enter" && props.isEditable) {
            props.setEditStatus(false);
        }
    }

    let [editedTime, handleEdittedTime] = useState(props.displayTime)

    const handleChange = (e) => {
        handleEdittedTime(e.target.value);
    }
    props.getEditedTime(editedTime);

    return (
        <input ref={props.targetNode} className="stopwatch__display" type="text" onChange={handleChange} defaultValue={props.displayTime} onKeyPress={handleKeyPress} />
    )
}

export default EditableTimeDisplay;