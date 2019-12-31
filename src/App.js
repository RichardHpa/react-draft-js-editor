import React, { useState } from 'react';
import './app.css';

import RhEditor from './Editor'

const  App = () => {
    const [output, setValue] = useState();

    const handleRecieveContent = (value) => {
        // console.log(value);
        setValue(value)
    }


    return (
        <div className="rhContainer">
            <div className="rhEdit">
                <RhEditor
                    showControls
                    recieveHtml={handleRecieveContent}
                />
            </div>
            <div className="rhOutput">
                <div dangerouslySetInnerHTML={{ __html: output }} />
            </div>
        </div>
    );
}

export default App;
