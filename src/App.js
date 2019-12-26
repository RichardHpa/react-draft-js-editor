import React from 'react';

import RhEditor from './Editor'

const  App = () => {

    const handleRecieveContent = (value) => {
        console.log(value);
    }

  return (
    <div>
        <RhEditor
            showControls
            recieveContent={handleRecieveContent}
        />
    </div>
  );
}

export default App;
