import React, { useState } from 'react';
import './app.css';

import RhEditor from './Editor'

const content = '{"blocks":[{"key":"a2h95","text":"THis is testing","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

const  App = () => {
    const [output, setValue] = useState();

    const handleRecieveContent = (value) => {
        setValue(value)
    }

    const handleRecieveEditorState = (state) => {

    }


    return (
        <div className="rhContainer">
            <div className="rhEdit">
                <RhEditor
                    startingBlocks={content}
                    showControls
                    recieveHtml={handleRecieveContent}
                    recieveEditorState={handleRecieveEditorState}
                />
            </div>
            <div className="rhOutput">
                <div dangerouslySetInnerHTML={{ __html: output }} />
            </div>
        </div>
    );
}

export default App;
