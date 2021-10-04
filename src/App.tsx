import React from 'react';
import Board from './components/Board';

function App() {
  return (
    <div>
    <div className="ui menu inverted">
      <div className="header item">
        sNAke
      </div>
    </div >
    <div className="ui container">
      <div className="ui four column centered grid">
      <Board/>
      </div>
      </div>
    </div>
  );
}

export default App;
