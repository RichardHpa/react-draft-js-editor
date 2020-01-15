import React, { useState } from 'react';
import './app.css';

import RhEditor from './Editor'

const content = "{\"blocks\":[{\"key\":\"7r7mr\",\"text\":\"Start typing content here and see the preview.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}";

const  App = () => {
    const [output, setOutput] = useState('<p>Start typing content here and see the preview.</p>');

    const handleRecieveContent = (value) => {
        setOutput(value)
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
                <h2>Preview</h2>
                <hr/>
                <div dangerouslySetInnerHTML={{ __html: output }} />
            </div>
        </div>
    );
}

export default App;
