import React from 'react';

const EditableTimeDisplay = (props) => {
    const handleKeyPress = (e) => {
        //change edit status when enter key is pressed.
        if (e.key === "Enter" && props.isEditable) {
            props.setEditStatus(false);
        }
    }
    return (
        <input ref={props.targetNode} className="stopwatch__display" type="text" defaultValue={props.displayTime} onKeyPress={handleKeyPress} />
    )
}

export default EditableTimeDisplay;