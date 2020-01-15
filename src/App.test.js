import React from 'react';
import ReactDOM from 'react-dom';
import RhEditor from './Editor'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RhEditor />, div);
});
